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

## Private face search

Face matching runs entirely in the visitor's browser with `@vladmandic/human`. The browser downloads only the face detection, alignment, and embedding models from this site, scans the current album locally, and compares those faces with an embedding generated from the visitor's selfie. The selfie and all generated embeddings stay in memory for the current tab and are never uploaded or persisted.

The first search in an album can take a moment because its photos are indexed on the visitor's device. Repeated searches in the same tab reuse the in-memory index. Matching is probabilistic, so the interface labels results as possible matches and asks visitors to review them.

## Deploy to Vercel

The existing `bsa-epfls-projects/photos` Vercel project serves `photos.bsaepfl.ch`. Each push to `main` runs [the GitHub Actions deployment workflow](.github/workflows/deploy.yml), which builds with the production Vercel configuration, deploys the result, and checks the live homepage. Vercel's own Git deployments are disabled in `vercel.json` to avoid duplicate deployments.

The workflow reads these GitHub Actions settings for this repository:

- Secret `VERCEL_TOKEN`: create a Vercel access token scoped to `bsa-epfls-projects` → `All Projects`, then save it under **Settings → Secrets and variables → Actions → New repository secret**. Never commit the token.
- Variable `VERCEL_ORG_ID`: `team_gPT08VVEPRob51JPC2BXPBTW`.
- Variable `VERCEL_PROJECT_ID`: `prj_xMTufaC6lhGa9hBJwCnkAdu8GoUr`.

After adding the secret, run **Actions → Deploy to Vercel → Run workflow** once to verify the setup. Future pushes to `main` deploy automatically.
