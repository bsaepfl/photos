import type { Human, Input } from "@vladmandic/human"
import type { Photo } from "@/data/albums"

export type FaceSearchProgress = {
  phase: "model" | "selfie" | "album" | "matching"
  current: number
  total: number
  message: string
}

type FaceIndexEntry = {
  src: string
  embeddings: number[][]
}

const MATCH_THRESHOLD = 0.52
const sessionFaceIndex = new Map<string, number[][]>()
let humanPromise: Promise<Human> | null = null

function getHuman(): Promise<Human> {
  if (humanPromise) return humanPromise

  humanPromise = import("@human-browser").then(async ({ Human }) => {
    const human = new Human({
      backend: "webgl",
      debug: false,
      async: true,
      warmup: "face",
      modelBasePath: "/models/face/",
      cacheModels: true,
      cacheSensitivity: 0,
      filter: {
        enabled: true,
        equalization: true,
        width: 1280,
        height: 0,
        return: false,
      },
      face: {
        enabled: true,
        detector: {
          rotation: true,
          maxDetected: 30,
          minConfidence: 0.28,
          minSize: 20,
          return: false,
        },
        mesh: { enabled: true, keepInvalid: false },
        description: { enabled: true, minConfidence: 0.35 },
        attention: { enabled: false },
        iris: { enabled: false },
        emotion: { enabled: false },
        antispoof: { enabled: false },
        liveness: { enabled: false },
        gear: { enabled: false },
      },
      body: { enabled: false },
      hand: { enabled: false },
      object: { enabled: false },
      segmentation: { enabled: false },
      gesture: { enabled: false },
    })

    await human.load()
    await human.warmup()
    return human
  }).catch((error) => {
    humanPromise = null
    throw error
  })

  return humanPromise
}

function loadImage(src: string, signal?: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = "async"
    if (src.startsWith("http")) image.crossOrigin = "anonymous"

    const abort = () => {
      image.src = ""
      reject(new DOMException("Face search was cancelled", "AbortError"))
    }

    signal?.addEventListener("abort", abort, { once: true })
    image.onload = () => {
      signal?.removeEventListener("abort", abort)
      resolve(image)
    }
    image.onerror = () => {
      signal?.removeEventListener("abort", abort)
      reject(new Error("A photo could not be read for local face search."))
    }
    image.src = src
  })
}

async function extractEmbeddings(human: Human, input: Input) {
  const result = await human.detect(input)
  return result.face
    .map((face) => face.embedding)
    .filter((embedding): embedding is number[] => Boolean(embedding?.length))
}

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

function optimizedFaceSearchSrc(src: string) {
  if (!src.startsWith("/")) return src
  return `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=62`
}

export async function findMatchingPhotoIds(
  selfieSrc: string,
  photos: Photo[],
  onProgress: (progress: FaceSearchProgress) => void,
  signal?: AbortSignal,
) {
  onProgress({ phase: "model", current: 0, total: 1, message: "Loading the private face model…" })
  const human = await getHuman()
  if (signal?.aborted) throw new DOMException("Face search was cancelled", "AbortError")

  onProgress({ phase: "selfie", current: 0, total: 1, message: "Finding your face in the selfie…" })
  const selfieImage = await loadImage(selfieSrc, signal)
  const selfieEmbeddings = await extractEmbeddings(human, selfieImage)
  if (!selfieEmbeddings.length) {
    throw new Error("We could not find a clear face in that selfie. Try a front-facing photo with good light.")
  }

  const selfieEmbedding = selfieEmbeddings[0]
  const uniqueSources = [...new Set(photos.map((photo) => photo.src))]
  const index: FaceIndexEntry[] = []

  for (let position = 0; position < uniqueSources.length; position += 1) {
    if (signal?.aborted) throw new DOMException("Face search was cancelled", "AbortError")
    const src = uniqueSources[position]
    onProgress({
      phase: "album",
      current: position,
      total: uniqueSources.length,
      message: `Scanning album photo ${position + 1} of ${uniqueSources.length} on this device…`,
    })

    let embeddings = sessionFaceIndex.get(src)
    if (!embeddings) {
      const image = await loadImage(optimizedFaceSearchSrc(src), signal)
      embeddings = await extractEmbeddings(human, image)
      sessionFaceIndex.set(src, embeddings)
    }
    index.push({ src, embeddings })
    await nextFrame()
  }

  onProgress({ phase: "matching", current: uniqueSources.length, total: uniqueSources.length, message: "Comparing faces locally…" })
  const matchingSources = new Set<string>()

  for (const entry of index) {
    const bestSimilarity = entry.embeddings.reduce(
      (best, embedding) => Math.max(best, human.match.similarity(selfieEmbedding, embedding)),
      0,
    )
    if (bestSimilarity >= MATCH_THRESHOLD) matchingSources.add(entry.src)
  }

  return photos.filter((photo) => matchingSources.has(photo.src)).map((photo) => photo.id)
}
