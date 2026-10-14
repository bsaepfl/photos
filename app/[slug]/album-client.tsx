"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BsaMark } from "@/components/bsa-mark"
import { Icons } from "@/components/icons"
import type { Album, Photo } from "@/data/albums"
import { findMatchingPhotoIds, type FaceSearchProgress } from "@/lib/face-search"

type LayoutMode = "justified" | "large" | "grid"
const PAGE_SIZE = 8

export function AlbumClient({ album }: { album: Album }) {
  const [query, setQuery] = useState("")
  const [activeQuery, setActiveQuery] = useState("")
  const [layout, setLayout] = useState<LayoutMode>("justified")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showDownloads, setShowDownloads] = useState(false)
  const [showFindMe, setShowFindMe] = useState(false)
  const [copied, setCopied] = useState(false)
  const [faceMatchIds, setFaceMatchIds] = useState<string[] | null>(null)

  const filteredPhotos = useMemo(() => {
    const term = activeQuery.trim().toLowerCase()
    return album.photos.filter((photo) => {
      const matchesFace = faceMatchIds === null || faceMatchIds.includes(photo.id)
      const matchesText = !term || [photo.filename, photo.alt, ...photo.tags].join(" ").toLowerCase().includes(term)
      return matchesFace && matchesText
    })
  }, [activeQuery, album.photos, faceMatchIds])

  const pageCount = Math.max(1, Math.ceil(filteredPhotos.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const visiblePhotos = filteredPhotos.slice(start, start + PAGE_SIZE)
  const activePhoto = selected === null ? null : visiblePhotos[selected]

  const closeLightbox = useCallback(() => {
    setSelected(null)
    setShowInfo(false)
    setShowDownloads(false)
    history.replaceState(null, "", location.pathname)
  }, [])

  const movePhoto = useCallback((direction: number) => {
    setSelected((current) => {
      if (current === null) return null
      return (current + direction + visiblePhotos.length) % visiblePhotos.length
    })
    setShowDownloads(false)
  }, [visiblePhotos.length])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (selected === null) return
      if (event.key === "Escape") closeLightbox()
      if (event.key === "ArrowLeft") movePhoto(-1)
      if (event.key === "ArrowRight") movePhoto(1)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [closeLightbox, movePhoto, selected])

  useEffect(() => {
    document.body.style.overflow = selected !== null || showFindMe ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [selected, showFindMe])

  useEffect(() => {
    const photoId = location.hash.replace("#photo=", "")
    if (!photoId) return
    const index = visiblePhotos.findIndex((photo) => photo.id === photoId)
    if (index >= 0) setSelected(index)
  }, [visiblePhotos])

  function openPhoto(index: number) {
    setSelected(index)
    setShowInfo(false)
    setShowDownloads(false)
    history.replaceState(null, "", `#photo=${visiblePhotos[index].id}`)
  }

  function submitSearch() {
    setActiveQuery(query)
    setPage(1)
  }

  async function sharePhoto() {
    if (!activePhoto) return
    const url = `${location.origin}${location.pathname}#photo=${activePhoto.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt("Copy this photo link", url)
    }
  }

  return (
    <main className="album-page">
      <header className="album-header">
        <Link href="/" className="back-link"><Icons.arrowLeft /> All events</Link>
        <a href="https://www.bsaepfl.ch" className="mini-brand" aria-label="BSA main site"><BsaMark /></a>
      </header>

      <section className="album-hero">
        <p className="eyebrow">{album.type} · {album.year}</p>
        <h1>{album.title}</h1>
        <div className="album-meta">
          <span><Icons.calendar />{album.dateLong}</span>
          <span><Icons.location />{album.location}</span>
          <span><Icons.camera />{filteredPhotos.length} {filteredPhotos.length === 1 ? "photo" : "photos"}</span>
        </div>
      </section>

      <section className="album-tools" aria-label="Album controls">
        <div className="search-row">
          <div className="search-field">
            <Icons.search />
            <input
              type="search"
              placeholder="Search photos"
              aria-label="Search photos"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") submitSearch() }}
            />
            {query && <button onClick={() => { setQuery(""); setActiveQuery(""); setPage(1) }} aria-label="Clear search"><Icons.close /></button>}
          </div>
          <button className="search-button" onClick={submitSearch} disabled={!query.trim()}>Search</button>
        </div>
        <div className="tool-row">
          <div className="layout-switcher" aria-label="Photo layout">
            {([
              ["justified", "Justified layout", Icons.rows],
              ["large", "Large layout", Icons.list],
              ["grid", "Grid layout", Icons.grid],
            ] as const).map(([value, label, LayoutIcon]) => (
              <button key={value} aria-label={label} aria-pressed={layout === value} onClick={() => setLayout(value)}><LayoutIcon /></button>
            ))}
          </div>
          <button className="find-me-button" onClick={() => setShowFindMe(true)}><Icons.userSearch /> Find Me</button>
        </div>
      </section>

      {faceMatchIds !== null && (
        <div className="face-filter-banner" role="status">
          <span><Icons.userSearch />Showing {faceMatchIds.length} possible {faceMatchIds.length === 1 ? "match" : "matches"}</span>
          <button onClick={() => setFaceMatchIds(null)}>Show all photos <Icons.close /></button>
        </div>
      )}

      {filteredPhotos.length ? (
        <>
          <section className={`photo-grid ${layout}`} aria-label="Event photos">
            {visiblePhotos.map((photo, index) => (
              <button className={`photo-tile tile-${index % 5}`} key={photo.id} onClick={() => openPhoto(index)} aria-label={`Open ${photo.alt}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={layout === "large" ? "(max-width: 900px) 100vw, 980px" : "(max-width: 640px) 50vw, 33vw"}
                />
                <span className="tile-overlay"><span>{String(start + index + 1).padStart(2, "0")}</span><span>View</span></span>
              </button>
            ))}
          </section>

          {pageCount > 1 && (
            <nav className="pagination" aria-label="Photo pages">
              <button disabled={page === 1} onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }) }}><Icons.chevronLeft /> Previous</button>
              <div>{Array.from({ length: pageCount }, (_, index) => <button className={page === index + 1 ? "current" : ""} key={index} aria-label={`Page ${index + 1}`} onClick={() => setPage(index + 1)}>{index + 1}</button>)}</div>
              <button disabled={page === pageCount} onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }) }}>Next <Icons.chevronRight /></button>
              <span>{start + 1}–{Math.min(start + PAGE_SIZE, filteredPhotos.length)} of {filteredPhotos.length}</span>
            </nav>
          )}
        </>
      ) : (
        <section className="empty-state"><Icons.search /><h2>No photos found</h2><p>Try a person, activity, or filename.</p><button onClick={() => { setQuery(""); setActiveQuery("") }}>Clear search</button></section>
      )}

      <footer className="album-footer">BSA Photo Archive · EPFL</footer>

      {activePhoto && selected !== null && (
        <Lightbox
          photo={activePhoto}
          index={start + selected}
          total={filteredPhotos.length}
          showInfo={showInfo}
          showDownloads={showDownloads}
          copied={copied}
          onClose={closeLightbox}
          onPrevious={() => movePhoto(-1)}
          onNext={() => movePhoto(1)}
          onToggleInfo={() => { setShowInfo((value) => !value); setShowDownloads(false) }}
          onToggleDownloads={() => { setShowDownloads((value) => !value); setShowInfo(false) }}
          onShare={sharePhoto}
        />
      )}

      {showFindMe && (
        <FindMeModal
          photos={album.photos}
          onClose={() => setShowFindMe(false)}
          onMatches={(matches) => {
            setQuery("")
            setActiveQuery("")
            setFaceMatchIds(matches)
            setPage(1)
            setShowFindMe(false)
          }}
        />
      )}
    </main>
  )
}

function Lightbox({ photo, index, total, showInfo, showDownloads, copied, onClose, onPrevious, onNext, onToggleInfo, onToggleDownloads, onShare }: {
  photo: Photo
  index: number
  total: number
  showInfo: boolean
  showDownloads: boolean
  copied: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  onToggleInfo: () => void
  onToggleDownloads: () => void
  onShare: () => void
}) {
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo lightbox">
      <div className="lightbox-top">
        <span className="lightbox-count">{index + 1} / {total}</span>
        <div className="lightbox-actions">
          <button className={showInfo ? "active" : ""} onClick={onToggleInfo} aria-label="Toggle photo info"><Icons.info /></button>
          <div className="download-wrap">
            <button className={showDownloads ? "active" : ""} onClick={onToggleDownloads} aria-label="Download options"><Icons.download /></button>
            {showDownloads && <div className="download-menu"><p>Download</p><a href={photo.src} download={`${photo.id}-web.jpg`}>Web <span>1600 px</span></a><a href={photo.src} download={`${photo.id}-large.jpg`}>Large <span>2200 px</span></a><a href={photo.src} download={photo.filename}>Original <span>JPG</span></a></div>}
          </div>
          <button onClick={onShare} aria-label="Copy photo link">{copied ? <Icons.check /> : <Icons.share />}</button>
          <button onClick={onClose} aria-label="Close lightbox"><Icons.close /></button>
        </div>
      </div>
      <button className="lightbox-nav previous" onClick={onPrevious} aria-label="Previous photo"><Icons.chevronLeft /></button>
      <div className={`lightbox-image-wrap ${showInfo ? "with-info" : ""}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={showInfo ? "80vw" : "100vw"} priority />
      </div>
      <button className="lightbox-nav next" onClick={onNext} aria-label="Next photo"><Icons.chevronRight /></button>
      {showInfo && <PhotoInfo photo={photo} />}
      {copied && <div className="copy-toast">Photo link copied</div>}
    </div>
  )
}

function PhotoInfo({ photo }: { photo: Photo }) {
  const groups = [
    ["Camera", [["Make", "Canon"], ["Model", photo.camera], ["Lens", photo.lens]]],
    ["Settings", [["Aperture", photo.aperture], ["Shutter", photo.shutter], ["ISO", photo.iso]]],
    ["Date", [["Taken", photo.takenAt]]],
    ["Image", [["Resolution", `${photo.width} × ${photo.height}`], ["Filename", photo.filename]]],
    ["Author", [["Credit", photo.credit]]],
  ] as const
  return (
    <aside className="photo-info">
      <div className="info-drag" />
      {groups.map(([label, rows]) => <section key={label}><h3>{label}</h3>{rows.map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</section>)}
    </aside>
  )
}

function FindMeModal({ photos, onClose, onMatches }: { photos: Photo[]; onClose: () => void; onMatches: (matches: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "searching" | "done" | "error">("idle")
  const [progress, setProgress] = useState<FaceSearchProgress | null>(null)
  const [matches, setMatches] = useState<string[]>([])
  const [error, setError] = useState("")

  useEffect(() => () => {
    abortRef.current?.abort()
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  function chooseFile(nextFile?: File) {
    if (!nextFile || nextFile.size > 5 * 1024 * 1024 || !nextFile.type.startsWith("image/")) return
    if (preview) URL.revokeObjectURL(preview)
    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
    setStatus("idle")
    setProgress(null)
    setError("")
  }

  async function runSearch() {
    if (!preview) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setStatus("searching")
    setMatches([])
    setError("")

    try {
      const matchIds = await findMatchingPhotoIds(preview, photos, setProgress, controller.signal)
      if (controller.signal.aborted) return
      setMatches(matchIds)
      setStatus("done")
    } catch (searchError) {
      if (searchError instanceof DOMException && searchError.name === "AbortError") return
      setError(searchError instanceof Error ? searchError.message : "Local face search could not be completed.")
      setStatus("error")
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="find-me-title" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
      <div className="find-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icons.close /></button>
        <div className="find-icon"><Icons.userSearch /></div>
        <p className="eyebrow">Face search</p>
        <h2 id="find-me-title">Find yourself in photos</h2>
        <p className="find-lede">Upload a selfie and we’ll find event photos that contain your face.</p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => chooseFile(event.target.files?.[0])} />
        <button
          className={`dropzone ${preview ? "has-preview" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }}
        >
          {preview ? <Image src={preview} alt="Selfie preview" fill unoptimized /> : <><Icons.upload /><strong>Drop your photo here or click to browse</strong><span>JPG, PNG, or WebP under 5 MB</span></>}
        </button>
        {file && status === "idle" && <button className="face-search-button" onClick={runSearch}>Find my photos</button>}

        {status === "searching" && (
          <div className="face-progress" aria-live="polite">
            <span className="face-spinner" />
            <div><strong>{progress?.message ?? "Starting private search…"}</strong><span>No images or face data are being uploaded.</span></div>
            {progress?.phase === "album" && <progress value={progress.current + 1} max={Math.max(progress.total, 1)} />}
          </div>
        )}

        {status === "done" && (
          <div className="face-result" aria-live="polite">
            <Icons.check />
            <div><strong>{matches.length ? `${matches.length} possible ${matches.length === 1 ? "match" : "matches"} found` : "No confident matches found"}</strong><span>{matches.length ? "Review the results—local recognition can make mistakes." : "Try another well-lit, front-facing selfie."}</span></div>
          </div>
        )}

        {status === "done" && matches.length > 0 && <button className="face-search-button" onClick={() => onMatches(matches)}>Show possible matches</button>}
        {(status === "done" || status === "error") && <button className="face-secondary-button" onClick={() => inputRef.current?.click()}>Choose another selfie</button>}
        {status === "error" && <div className="face-error" role="alert">{error}</div>}
        <p className="privacy-note">Private by design: processing happens in this tab. Your selfie and face data are never uploaded or saved.</p>
      </div>
    </div>
  )
}
