import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/report/:id',
        destination: '/reports/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
