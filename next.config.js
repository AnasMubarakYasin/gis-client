/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/resources/:path*",
        destination: "http://localhost:5000/resources/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
      {
        source: "/event/:path*",
        destination: "http://localhost:5000/event/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
