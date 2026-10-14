import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://photos.bsaepfl.ch"),
  title: {
    default: "BSA Photos — Blockchain Student Association",
    template: "%s · BSA Photos",
  },
  description: "Photos from Blockchain Student Association events at EPFL.",
  openGraph: {
    title: "BSA Photo Archive",
    description: "Browse and download photos from BSA events at EPFL.",
    siteName: "BSA Photos",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
