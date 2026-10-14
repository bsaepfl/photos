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

The existing `bsa-epfls-projects/photos` Vercel project serves `photos.bsaepfl.ch`. Each push to `main` runs [the GitHub Actions deployment workflow](.github/workflows/deploy.yml), which builds with the production Vercel configuration, deploys the result, and checks the live homepage. Vercel's own Git deployments are disabled in `vercel.json` to avoid duplicate deployments.

The workflow reads these GitHub Actions settings for this repository:

- Secret `VERCEL_TOKEN`: create a Vercel access token scoped to `bsa-epfls-projects` → `All Projects`, then save it under **Settings → Secrets and variables → Actions → New repository secret**. Never commit the token.
- Variable `VERCEL_ORG_ID`: `team_gPT08VVEPRob51JPC2BXPBTW`.
- Variable `VERCEL_PROJECT_ID`: `prj_xMTufaC6lhGa9hBJwCnkAdu8GoUr`.

After adding the secret, run **Actions → Deploy to Vercel → Run workflow** once to verify the setup. Future pushes to `main` deploy automatically.
