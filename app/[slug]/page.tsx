import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AlbumClient } from "./album-client"
import { albums, getAlbum } from "@/data/albums"

export function generateStaticParams() {
  return albums.map((album) => ({ slug: album.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const album = getAlbum(slug)
  if (!album) return { title: "Album not found" }
  return {
    title: album.title,
    description: `${album.photos.length} photos from ${album.title} at ${album.location}.`,
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const album = getAlbum(slug)
  if (!album) notFound()
  return <AlbumClient album={album} />
}
