import Image from "next/image"
import Link from "next/link"
import { BsaMark } from "@/components/bsa-mark"
import { Icons } from "@/components/icons"
import { albumsByYear } from "@/data/albums"

export default function HomePage() {
  const years = Object.keys(albumsByYear).map(Number).sort((a, b) => b - a)

  return (
    <main className="archive-shell">
      <header className="site-mark">
        <a href="https://www.bsaepfl.ch" aria-label="Visit the BSA main website" className="brand-link">
          <span className="brand-symbol"><BsaMark /></span>
          <span className="brand-copy"><strong>BSA</strong><span>EPFL</span></span>
        </a>
        <a href="https://www.bsaepfl.ch/events" className="main-site-link">Main site <span aria-hidden="true">↗</span></a>
      </header>

      <section className="archive-intro">
        <p className="eyebrow">Photo archive</p>
        <h1>Browse BSA<br className="mobile-break" /> event albums</h1>
        <p className="intro-copy">The people, ideas, and late nights behind our community at EPFL.</p>
      </section>

      {years.map((year) => (
        <section className="year-section" key={year}>
          <div className="year-heading"><span>{year}</span></div>
          <div className="album-grid">
            {albumsByYear[year].map((album) => (
              <Link href={`/${album.slug}`} className="album-card" key={album.slug}>
                <div className="album-collage" aria-hidden="true">
                  {album.photos.slice(0, 3).map((photo, index) => (
                    <div className={`collage-panel panel-${index + 1}`} key={photo.id}>
                      <Image src={photo.src} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" priority={year === years[0]} />
                    </div>
                  ))}
                  <span className="photo-count">{album.photos.length} photos</span>
                  <span className="collage-scan" />
                </div>
                <div className="album-details">
                  <span className="album-glyph"><BsaMark /></span>
                  <div className="album-copy">
                    <span className="album-type">{album.type}</span>
                    <h2>{album.title}</h2>
                    <p><Icons.calendar />{album.date}</p>
                    <p><Icons.location />{album.location}</p>
                  </div>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="archive-footer">
        <span>© {new Date().getFullYear()} Blockchain Student Association</span>
        <span>EPFL · Lausanne, Switzerland</span>
      </footer>
    </main>
  )
}
