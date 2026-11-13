# Development workflow

One path, no exceptions:

**Local Mac -> GitHub `main` -> Vercel -> https://markgomez.vercel.app**

- GitHub (`romemcg/Mark-Portfolio`) holds the complete Next.js source and is the single source of truth.
- `main` is the only production branch. Vercel builds it (`next build`, static export to `out/`) and serves it at https://markgomez.vercel.app.
- Every other branch becomes a Vercel Preview only. Previews never touch the production domain.
- There is no separate "built output" branch and no second site. `mark-gomez.vercel.app` only redirects to the official domain (see `vercel.json`).

## For every change

1. Start from the current GitHub `main`: `git switch main && git pull origin main`.
2. Create a feature branch: `git switch -c feature/<short-name>`.
3. Develop locally (`npm run dev`). Content lives in `content/data.ts`.
4. Test before merging: `npm ci --include=dev && npm run build`, then check the pages you touched at desktop, tablet and mobile widths, and confirm there are no console errors.
5. Commit completed work with a clear message and push the branch: `git push -u origin feature/<short-name>`.
6. Open the Vercel Preview for that branch and check it.
7. Merge to `main` through a pull request on GitHub. Do not push straight to `main`.
8. Verify production: the Vercel deployment for the merge commit shows "Ready" and Production, then check https://markgomez.vercel.app.
9. Report: repository and branch, deployed commit hash, push status, Vercel deployment status, production URL, and the live verification result.

## Rules

- Never deploy from the local folder (`vercel deploy` from the Mac is not part of this workflow). It publishes files GitHub has never seen and replaces what `main` built.
- Never force-push, reset or delete branches without explicit approval. Preserve work in a backup branch first.
- Do not report a change as live because it works locally or the build passes. It is live only when the Vercel Production deployment for the intended commit is Ready and the live site shows it.
- The CV and one-pager PDFs are downloads. After changing `content/data.ts`, rebuild the one-pager: `node --experimental-strip-types --no-warnings tools/export-onepager-data.mjs > /tmp/op.json && python3 tools/build-onepager.py /tmp/op.json public/Mark-Gomez-One-Pager.pdf` (needs `pip install reportlab`).
- If your shell sets `NODE_ENV=production`, plain `npm ci` skips dev dependencies and the build fails. Use `npm ci --include=dev`.
