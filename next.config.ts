import type { NextConfig } from "next";

// GitHub Actions sets this env var automatically during CI builds.
// Locally (npm run dev / npm run build) it stays unset, so the site
// serves from "/" as usual — only the GitHub Pages build gets the
// "/quality-bikes" subpath prefix.
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repoName = "quality-bikes";

const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: isGithubPages ? `${basePath}/` : "",
  // next/image and plain <img> tags don't auto-prefix basePath (unlike
  // next/link), so we expose it to client code via src/lib/base-path.ts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
