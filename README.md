# Minimal Blog

A statically exported Next.js blog optimized for low-cost deployment on Cloudflare Pages.

## Stack

- Next.js App Router
- MDX via `content-collections`
- `next-intl` for `zh`, `en`, `ja`
- Tailwind CSS
- Static assets served from `public/`

## Runtime model

This project now deploys as a pure static site:

- output directory: `out/`
- no database
- no tRPC API
- no middleware-based locale routing
- no comments or view counters

That keeps the deployment nearly free and better suited to visitors in mainland China without ICP filing.

## Environment variables

Create `.env` from `.env.example` and set:

```env
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

`NEXT_PUBLIC_SITE_URL` is used for canonical URLs, `robots.txt`, `sitemap.xml`, and `rss.xml`.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/` during development. It now redirects to `http://localhost:3000/zh`.

If you want to inspect a specific locale directly, use:

- `http://localhost:3000/zh`
- `http://localhost:3000/en`
- `http://localhost:3000/ja`

## Validation

```bash
npm run validate:posts
npm run validate:images
npm run optimize:images
npm run typecheck
npm run build
```

A successful build exports the site to `out/`.

## Local preview

```bash
npm run preview
```

This serves the generated `out/` directory instead of running `next start`.

Use `npm run preview` as the main acceptance check for the final static site. It is closer to Cloudflare Pages than `npm run dev`.

## Deployment target

The recommended deployment target is Cloudflare Pages.

- Build command: `npm ci && npm run build`
- Build output directory: `out`
- Node version: `22`
- Required env var: `NEXT_PUBLIC_SITE_URL=https://your-domain.com`

## Cloudflare Pages files

This repo includes:

- `public/_redirects` for locale and RSS redirects
- `public/_headers` for cache rules on static assets

## Performance workflow

Run a fresh static build first, then the repeatable Lighthouse workflow:

```bash
npm run build
npm run perf:lighthouse
npm run perf:report
```

The Lighthouse runner:

- blocks execution if port `3000` is already occupied
- verifies `out/` is newer than the current source tree
- serves the static export on an isolated port
- saves production-only JSON reports to `reports/lighthouse`
- writes a Markdown summary to `reports/lighthouse/SUMMARY.md`

You can also measure a single page:

```bash
npm run perf:lighthouse -- /en/blog
```

## Content workflow

The writing flow remains:

1. Edit content in Obsidian or your editor
2. Commit and push to GitHub
3. Let Cloudflare Pages rebuild the site

## Notes for mainland China access

- This setup does not use mainland China nodes because the site is intentionally deployed without ICP filing.
- The speed improvement comes from static export, aggressive caching, simpler assets, and Cloudflare's global edge network.
- If you later decide to obtain ICP filing, you can add a mainland-compatible CDN strategy on top of this baseline.
