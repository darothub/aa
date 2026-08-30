# Wedding site — Next.js rebuild

Real build of the `poc/` prototype: same look and copy, ported into a Next.js
App Router app, with the RSVP form wired to an actual API route + Postgres
table instead of the prototype's fake 900ms `setTimeout`.

## Run locally

```bash
cd web
npm install
cp .env.example .env.local   # fill in DATABASE_URL once you have a database
npm run dev
```

## Database

Run `migrations/0001_create_rsvps.sql` against whatever Postgres instance
`DATABASE_URL` points to. Data access uses `@neondatabase/serverless`
directly — attach a Postgres database from the Vercel Marketplace (Neon is
the native integration) and Vercel injects `DATABASE_URL` into the deployed
environment automatically.

## Deploying to the existing Vercel project

The prototype's Vercel project is named `dist` (see `poc/.vercel/project.json`
in the checkout). To deploy this app to that same project and preserve the
guest-facing URL:

1. In the Vercel dashboard, set that project's **Root Directory** to `web`
   (or run `vercel link` from inside `web/` and choose the existing `dist`
   project) — this is a project setting, not something a committed file can
   change.
2. Attach a Postgres database (Vercel Marketplace → Neon) to the project so
   `DATABASE_URL` is set automatically in the deployed environment.
3. Push — Vercel picks up `web/package.json`'s `build` script.

## What's intentionally not carried over yet

- **Photos**: see `public/images/README.md` — the prototype's photo slots
  never produced real image files, so placeholders point at filenames that
  need to be supplied.
- **Story carousel transition**: simplified to the existing CSS slide
  transition; the prototype's custom "curtain wipe" Web Animations sequence
  was dropped as a first-pass scope cut (nice-to-have, not load-bearing).
- **QR code and map**: reimplemented with real npm dependencies (`qrcode`,
  `leaflet`) instead of the prototype's CDN `<script>` tags — the QR one was
  loading from the unpinned `@master` branch of a GitHub-hosted CDN.
