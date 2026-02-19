import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.ophim.live",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
