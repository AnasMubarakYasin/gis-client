/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/resources/:path*",
        destination: "http://localhost:5000/resources/:path*",
        basePath: false,
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;
