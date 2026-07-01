// Needed because the site is deployed as a static export under a GitHub
// Pages subpath ("/quality-bikes"). next/image and plain <img> tags don't
// auto-prefix basePath the way next/link does, so any hardcoded root-relative
// asset path (logo, inventory photos) must go through this helper.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string) {
  return `${basePath}${path}`;
}
