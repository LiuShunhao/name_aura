import type { NextConfig } from "next";

const desktopExport = process.env.DESKTOP_EXPORT === "1"
const pagesExport = process.env.PAGES_EXPORT === "1"
const basePath = pagesExport ? "/name_aura" : ""

const nextConfig: NextConfig = {
  // The dev server listens on 0.0.0.0, so Next only trusts that host plus localhost.
  // Browsers that open http://127.0.0.1:38471 are a different origin; without this
  // entry the HMR socket is rejected and the page stays as static HTML.
  ...(desktopExport || pagesExport
    ? { output: "export" as const, basePath, trailingSlash: true }
    : { allowedDevOrigins: ["127.0.0.1"], cacheComponents: true, partialPrefetching: true }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
