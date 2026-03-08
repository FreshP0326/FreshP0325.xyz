# Cloudflare Pages Checklist for `freshp0325.xyz`

> Assumption: your production domain is `freshp0325.xyz`, based on the earlier deployment notes in this project.
> If your real domain is different, replace `freshp0325.xyz` and `www.freshp0325.xyz` below before executing.

## 1. GitHub repository

Create a new GitHub repository and push this standalone repo:

```bash
git remote add origin https://github.com/FreshP0326/freshp0325.xyz.git
git add .
git commit -m "Convert blog to Cloudflare Pages static export"
git push -u origin main
```

## 2. Create the Pages project

In Cloudflare dashboard:

1. Open `Workers & Pages`
2. Click `Create application`
3. Choose `Pages`
4. Choose `Connect to Git`
5. Authorize GitHub if needed
6. Select your new `minimal-blog` repository

## 3. Build settings

Use these exact values:

- Framework preset: `Next.js (Static HTML Export)` if available, otherwise `None`
- Production branch: `main`
- Build command: `npm ci && npm run build`
- Build output directory: `out`
- Root directory: `/`
- Node.js version: `22`

## 4. Environment variables

Add this production variable in Cloudflare Pages:

- `NEXT_PUBLIC_SITE_URL` = `https://freshp0325.xyz`

If you use preview deployments, add the same variable there too.

## 5. Test on `pages.dev`

Before switching DNS:

1. Trigger the first deploy
2. Open the generated `*.pages.dev` URL
3. Check these URLs manually:
   - `/`
   - `/zh/`
   - `/en/`
   - `/ja/`
   - `/zh/blog/`
   - `/rss.xml`
   - `/robots.txt`
   - `/sitemap.xml`
   - `/search-index.json`

Expected behavior:

- `/` redirects to `/zh/`
- article pages open normally
- no comment box appears
- no view counter appears

## 6. Move DNS to Cloudflare

In Cloudflare:

1. Add the site `freshp0325.xyz`
2. Cloudflare will assign two nameservers
3. Go to your domain registrar
4. Replace the current NS records with the Cloudflare nameservers
5. Wait until Cloudflare shows the zone as active

## 7. Attach custom domains in Pages

After the zone is active:

1. Open your Pages project
2. Go to `Custom domains`
3. Add `freshp0325.xyz`
4. Add `www.freshp0325.xyz`

Recommended final setup:

- Primary domain: `freshp0325.xyz`
- Redirect `www.freshp0325.xyz` -> `https://freshp0325.xyz`

## 8. SSL and traffic settings

Recommended Cloudflare settings:

- SSL/TLS mode: `Full` or `Full (strict)`
- Always Use HTTPS: `On`
- Auto Minify: `On` for HTML/CSS/JS
- Brotli: `On`
- Early Hints: `On`

Keep the site as pure Pages hosting. Do not add Workers or Functions unless you explicitly want dynamic behavior again.

## 9. Post-cutover validation

After `freshp0325.xyz` is live, verify:

- `https://freshp0325.xyz/` redirects to `https://freshp0325.xyz/zh/`
- `https://www.freshp0325.xyz/` redirects to `https://freshp0325.xyz/`
- `https://freshp0325.xyz/rss.xml` returns XML
- `https://freshp0325.xyz/sitemap.xml` returns XML
- `https://freshp0325.xyz/robots.txt` returns text
- static assets under `/_next/static/` are cacheable

## 10. Rollback

If anything fails after DNS cutover:

1. Remove the custom domain from Pages or pause traffic changes
2. Restore your previous DNS/hosting setup at the registrar if needed
3. Fix the GitHub repo and redeploy Pages
4. Retry the custom-domain step only after `pages.dev` works again
