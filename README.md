# BSA Photo Archive

A Vercel-ready photo archive for the Blockchain Student Association at EPFL. The interaction model follows the ETHGlobal photo archive, with BSA's navy, typography, logo, and restrained green/blue accents.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add an event album

1. Add optimized JPG or WebP files to `public/photos/<event-slug>/`.
2. Add an album entry in `data/albums.ts` and include each photo's searchable tags and metadata.
3. Run `npm run build` before deployment.

The current repository includes a compact sample collection sourced from the BSA main website. For a large production collection, keep the same data shape but serve image variants from object storage (Cloudflare R2, S3, or Cloudinary) rather than committing originals to Git.

## Face search

The complete selfie picker and privacy messaging are implemented. The prototype deliberately keeps the selfie local and does not pretend to perform biometric matching. Before launch, connect the final action to a consent-reviewed face-search service or remove the `Find Me` control. Face descriptors should be processed server-side, encrypted at rest, scoped per event, and deleted on a short retention schedule.

## Deploy to Vercel

Import this repository into Vercel, keep the default Next.js settings, then point `photos.bsaepfl.ch` at the generated Vercel domain. The metadata base is already configured for that subdomain.
