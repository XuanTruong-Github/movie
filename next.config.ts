import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.phimapi.com", pathname: "/**" },
      { protocol: "https", hostname: "phimimg.com", pathname: "/**" },
      { protocol: "https", hostname: "*.phimapi.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
