import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full client-side (SPA): hasil build berupa folder `out/` statis
  // yang bisa dideploy ke Cloudflare Pages / hosting statis apa pun.
  output: "export",
  images: {
    // Optimasi gambar server tidak tersedia pada static export.
    unoptimized: true,
  },
};

export default nextConfig;
