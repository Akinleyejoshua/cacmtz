import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/give",
        destination: "/donate",
        permanent: true,
      },
      {
        source: "/events",
        destination: "/#events",
        permanent: true,
      },
      {
        source: "/event",
        destination: "/#events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
