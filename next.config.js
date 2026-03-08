// @ts-nocheck
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withContentCollections } from "@content-collections/next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  output: "export",
  experimental: {
    viewTransition: true,
  },
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.hdslb.com",
      },
      {
        protocol: "https",
        hostname: "api.bilibili.com",
      },
    ],
  },
};

export default withContentCollections(withNextIntl(config));
