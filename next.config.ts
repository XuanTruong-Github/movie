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
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
