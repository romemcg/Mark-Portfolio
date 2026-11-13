# Mark Gomez portfolio

Next.js source for the portfolio. **This repository is the single source of truth.**

Workflow: local development, commit, push to GitHub, Vercel builds and deploys from the production branch, then verify the live site.

- Build: `npm ci && npm run build` (static export to `out/`)
- Production branch: `main` (set in Vercel project settings)
- Work on a branch and open a pull request. Vercel creates a preview for every branch.
- Never deploy from local files with the Vercel CLI.
- Digital Twin reveal: see `docs/DIGITAL_TWIN.md`.
