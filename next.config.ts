import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.wellsforzoe.org",
      },
    ],
  },
};

export default nextConfig;
