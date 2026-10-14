export type Photo = {
  id: string
  src: string
  alt: string
  filename: string
  tags: string[]
  width: number
  height: number
  takenAt: string
  camera: string
  lens: string
  aperture: string
  shutter: string
  iso: string
  credit: string
}

export type Album = {
  slug: string
  year: number
  title: string
  shortTitle: string
  date: string
  dateLong: string
  location: string
  type: "Conference" | "Hackathon"
  photos: Photo[]
}

const hackathonPhotoDimensions = [
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 2259],
  [2400, 1800],
  [2400, 1800],
  [1800, 2400],
  [2400, 1800],
  [2400, 1652],
  [2400, 1800],
  [1800, 2400],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1895],
  [2400, 1800],
  [2400, 1800],
  [2400, 1698],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [1799, 2400],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 2022],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1778],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1962],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [1800, 2400],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [1800, 2400],
  [2400, 1669],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [1969, 2400],
  [2400, 1800],
  [2400, 1778],
  [2400, 1800],
  [2400, 1642],
  [2400, 1800],
  [2400, 1800],
  [2400, 1696],
  [2400, 1800],
  [2400, 1677],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [1800, 2400],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1964],
  [2400, 1800],
  [1866, 2400],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [1800, 2400],
  [2400, 1799],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [2400, 1800],
  [1800, 2400],
  [2400, 1800],
  [2400, 1800],
  [1800, 2400],
  [1800, 2400],
  [2400, 1800],
  [2400, 1800],
  [2400, 1829],
  [2400, 1800],
] as const

const hackathonPhotos: Photo[] = hackathonPhotoDimensions.map(([width, height], index) => {
  const number = String(index + 1).padStart(5, "0")

  return {
    id: `the-hackathon-${number}`,
    src: `/photos/the-hackathon/the-hackathon-${number}.jpg`,
    alt: `Participants building at The Hackathon at EPFL, photo ${index + 1}`,
    filename: `image${number}.JPG`,
    tags: [
      "the hackathon",
      "hackathon",
      "epfl",
      "bc building",
      "blockchain",
      "students",
      index % 3 === 0 ? "people" : "building",
      index % 5 === 0 ? "teams" : "community",
    ],
    width,
    height,
    takenAt: "October 10–11, 2026",
    camera: "Olympus OM-D E-M10 Mark II",
    lens: "Metadata unavailable",
    aperture: "—",
    shutter: "—",
    iso: "—",
    credit: "Blockchain Student Association — EPFL",
  }
})

export const albums: Album[] = [
  {
    slug: "the-hackathon-2026",
    year: 2026,
    title: "The Hackathon",
    shortTitle: "The Hackathon",
    date: "Oct 10–11, 2026",
    dateLong: "October 10–11, 2026 · CEST",
    location: "BC Building · EPFL, Ecublens",
    type: "Hackathon",
    photos: hackathonPhotos,
  },
]

export function getAlbum(slug: string) {
  return albums.find((album) => album.slug === slug)
}

export const albumsByYear = albums.reduce<Record<number, Album[]>>((groups, album) => {
  groups[album.year] ??= []
  groups[album.year].push(album)
  return groups
}, {})
