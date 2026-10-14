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

const sourcePhotos = [
  {
    src: "/photos/privacy-01.jpg",
    width: 2200,
    height: 1467,
    takenAt: "October 12, 2024 at 10:35",
    alt: "BSA attendees listening to a talk at EPFL",
    tags: ["audience", "talk", "stage", "students", "epfl"],
  },
  {
    src: "/photos/privacy-02.jpg",
    width: 2200,
    height: 1467,
    takenAt: "October 12, 2024 at 12:55",
    alt: "Students building together during a BSA event",
    tags: ["hackers", "building", "team", "laptops", "students"],
  },
  {
    src: "/photos/privacy-03.jpg",
    width: 2200,
    height: 1467,
    takenAt: "March 8, 2025 at 21:47",
    alt: "BSA community members at the Privacy and Verifiability event",
    tags: ["community", "networking", "privacy", "conference", "epfl"],
  },
] as const

function photosFor(prefix: string, count: number, shift = 0): Photo[] {
  return Array.from({ length: count }, (_, index) => {
    const source = sourcePhotos[(index + shift) % sourcePhotos.length]
    return {
      id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
      src: source.src,
      alt: source.alt,
      filename: `${prefix.toUpperCase()}_${String(index + 1).padStart(4, "0")}.jpg`,
      tags: [...source.tags, prefix, index % 2 === 0 ? "people" : "venue"],
      width: source.width,
      height: source.height,
      takenAt: source.takenAt,
      camera: "Canon EOS 2000D",
      lens: "EF-S 18–55mm f/3.5–5.6",
      aperture: index % 2 === 0 ? "f/4.0" : "f/5.6",
      shutter: index % 3 === 0 ? "1/125s" : "1/160s",
      iso: index % 2 === 0 ? "1600" : "3200",
      credit: "Blockchain Student Association EPFL",
    }
  })
}

export const albums: Album[] = [
  {
    slug: "privacy-verifiability-conference-2025",
    year: 2025,
    title: "Privacy & Verifiability Conference",
    shortTitle: "Privacy & Verifiability",
    date: "Mar 7, 2025",
    dateLong: "March 7, 2025 · CET",
    location: "EPFL, Lausanne, Switzerland",
    type: "Conference",
    photos: photosFor("pvc", 12, 2),
  },
  {
    slug: "privacy-verifiability-hackathon-2025",
    year: 2025,
    title: "Privacy & Verifiability Hackathon",
    shortTitle: "P&V Hackathon",
    date: "Mar 8–9, 2025",
    dateLong: "March 8–9, 2025 · CET",
    location: "EPFL, Lausanne, Switzerland",
    type: "Hackathon",
    photos: photosFor("pvh", 9, 1),
  },
  {
    slug: "sui-bsa-hackathon-2024",
    year: 2024,
    title: "Sui × BSA Hackathon · 2nd Edition",
    shortTitle: "Sui × BSA · 02",
    date: "Oct 12–13, 2024",
    dateLong: "October 12–13, 2024 · CEST",
    location: "EPFL, Lausanne, Switzerland",
    type: "Hackathon",
    photos: photosFor("sui", 10, 0),
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
