import path from "node:path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack(config) {
    config.resolve.alias["@human-browser"] = path.resolve(
      process.cwd(),
      "node_modules/@vladmandic/human/dist/human.esm.js",
    )
    return config
  },
}

export default nextConfig
