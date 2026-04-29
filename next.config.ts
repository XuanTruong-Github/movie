import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.ophim.live",
        port: "",
        pathname: "/uploads/**",
      },
    ],
    formats: ["image/webp", "image/avif"], // Dùng định dạng nhẹ hơn JPG/PNG
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 2592000, // 30 ngày — local dev + forward-compat với adapter update
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
