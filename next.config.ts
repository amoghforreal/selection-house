import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "cblcrbxbjqktjtynxkqy.supabase.co",
      },
    ],
  },
};

export default nextConfig;
