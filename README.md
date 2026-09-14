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
directly, which speaks HTTP rather than TCP and so works on Workers as well as
on Vercel.

## Deploying to Cloudflare (Workers, via OpenNext)

The site deploys as a **Worker with static assets**, built by
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). It replaces
`@cloudflare/next-on-pages`, which Cloudflare has deprecated in favour of
OpenNext. Three files carry the setup:

| File | What it does |
|---|---|
| `wrangler.toml` | Worker name, `main = ".open-next/worker.js"`, and the `[assets]` binding pointing at `.open-next/assets`. |
| `open-next.config.ts` | The adapter's config. Empty defaults — no ISR here, so no cache backend is wired. |
| `next.config.mjs` | Calls `initOpenNextCloudflareForDev()` so `next dev` can see Cloudflare bindings. |

Build output is `.open-next/`, not `.vercel/output/static`.

### Deploy from your machine

```bash
cd web
npm install
npx wrangler login       # once
npm run cf:deploy
```

`cf:deploy` runs `next build`, converts the output, then calls `wrangler
deploy`. Unlike Pages, this **creates the Worker on first deploy** — there is
no `wrangler pages project create` prerequisite and no
`Project not found [code: 8000007]` failure mode.

To run the real Worker locally before shipping:

```bash
npm run cf:preview
```

### Secrets

```bash
npx wrangler secret put DATABASE_URL
```

`process.env.DATABASE_URL` is populated from the Worker's env at request time,
so `lib/db.ts` needs no change. For plain `next dev`, keep the value in
`.env.local`; for `npm run cf:preview` (which runs under workerd) put it in
`.dev.vars`:

```
DATABASE_URL=postgres://...
```

Both files are gitignored.

### Deploy from Git (Workers Builds)

In the Cloudflare dashboard → **Workers & Pages → this Worker → Settings →
Builds**:

- Root directory: `web`
- Build command: `npm run cf:build`
- Deploy command: `npx opennextjs-cloudflare deploy`

The API token in `CLOUDFLARE_API_TOKEN` needs **Account → Workers Scripts →
Edit**. The **Cloudflare Pages → Edit** scope the previous setup required no
longer applies; a Super Administrator *membership role* still grants a token
nothing on its own.

### If a Pages project was already created

A Pages project named `aa-wedding-site` (or `aa`) is now unused — this deploy
never touches it. Delete it, and move any custom domain attached to it over to
the Worker.

### Reading the failure modes

| Error | What it actually means |
|---|---|
| `Authentication error [code: 10000]` | Token is valid but lacks the scope for the operation. For Workers that is Workers Scripts: Edit. |
| `It looks like you've run a Workers-specific command in a Pages project` | `wrangler.toml` still sets `pages_build_output_dir`; the OpenNext config must not. |
| `No matching export ... .open-next/worker.js` | `opennextjs-cloudflare build` did not run before `wrangler deploy`. Use the `cf:*` scripts, which chain them. |

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
