# Performance Follow-up - 2026-03-08

## Implemented

- Added `npm run perf:lighthouse` and `scripts/run-lighthouse.ts` for repeatable production-only Lighthouse runs.
- Added `npm run perf:report` and `reports/lighthouse/SUMMARY.md` for repeatable hotspot attribution.
- Removed the layout-level search provider wrapper and localized search state to the header controls subtree.
- Split the header into `SiteHeaderShell` and `SiteHeaderControls`.
- Moved language, theme mode, and theme hue controls behind on-demand loading.
- Split the home landing into `HomeLandingStatic` and a thin `HomeLandingGate` state island.
- Moved the post route into `src/app/[locale]/blog/(post)/[slug]/page.tsx` to keep post-only client references out of the blog index chunk graph.
- Converted the article TOC to a server-rendered component backed by build-time heading extraction.
- Split post/biography MDX rendering from discography MDX so `Tabs` no longer sits on the post rendering path.
- Replaced broad `radix-ui` aggregate imports with precise `@radix-ui/react-slot` and `@radix-ui/react-popover` imports, which removed the large `418/767/557` shared chunk chain from the blog page.
- Replaced the blog/post sidebar `ProfileCard` locale link wrapper with plain `next/link` to avoid unnecessary `next-intl` navigation coupling in that subtree.
- Replaced the post interaction client stack from `tRPC + react-query` hooks to a shared server-side data layer plus server actions, removing the heavy article-only interaction payload from the client bundle.
- Switched header and mobile navigation active-state links to `next/link` + `next/navigation` in the always-loaded header path.
- Reduced sidebar/content panel visual complexity by removing backdrop blur and the sidebar scroll mask, and simplified blog list card hover styling to lower layout/paint cost.
- Removed `NextIntlClientProvider` from the shared layout and converted the remaining locale-changing/search navigation client code to plain Next.js navigation APIs.
- Split `src/i18n/routing.ts` into a pure routing-config module shape, which removed `next-intl` navigation client artifacts from the shared page graph.

## Latest Production Lighthouse

| Page | Score | FCP | LCP | TBT | TTI | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/en` | 70 | 805 ms | 8905 ms | 249 ms | 8905 ms | 0 |
| `/en/blog` | 56 | 1368 ms | 9168 ms | 780 ms | 9168 ms | 0 |
| `/en/blog/2026-01-10_resource-management-naming` | 92 | 1281 ms | 2348 ms | 294 ms | 2525 ms | 0 |

Reports were generated from `next start` on an isolated port and saved to `reports/lighthouse`.
The runner validates that development-only artifacts such as `next-devtools`, `hot-reloader-app.js`, and `*.development.js` are absent from the JSON output.

## Build Output Changes

| Route | Before | After |
| --- | ---: | ---: |
| `/[locale]/blog` First Load JS | 186 kB | 111 kB |
| `/[locale]/blog/[slug]` First Load JS | 198 kB | 124 kB |
| Post interaction lazy chunk (`84.*.js` ? `843.*.js`) | 28.9 kB | 8.8 kB |
| Middleware bundle | 70.3 kB | 45.8 kB |

## Attribution Highlights

- The shared layout client graph is smaller and cleaner: `next-intl` navigation client artifacts no longer appear in the blog page manifest, and the remaining shared route-level chunk has dropped to a smaller `619-...js` file instead of the previous `BaseLink`-carrying chain.
- The article page remains the strongest winner in the latest run: `score 92`, `LCP 2348 ms`, `TTI 2525 ms`, `TBT 294 ms`.
- The post interaction chunk shrank by roughly 70% after removing `@tanstack/react-query`, `@trpc/*`, and `superjson` from the client path.
- The biggest remaining hotspot is no longer article-specific JavaScript; it is now the cross-route framework/runtime set (`4bd1...`, `255...`) plus blog-page layout/paint cost.
- Blog-page Lighthouse scores remain noisy and still regress in some runs even when bundle structure improves, so the more trustworthy signal is that large route-specific unused-JS hotspots have stayed gone while the build output remains significantly smaller than the original baseline.

## Notes

- Windows still triggers Lighthouse temp-directory cleanup `EPERM` errors after report generation, but the script treats the run as successful when the JSON output is present and structurally valid.
- The local perf environment still logs `ECONNREFUSED` for database-backed post interactions when the backing service is unavailable; Lighthouse JSON generation remains valid, but this variance can slightly perturb article-page timings.
- Lighthouse remains somewhat noisy run-to-run, so the clearest signals here are build output, manifest composition, and repeated absence of large shared client hotspots in the blog/post route graphs.
