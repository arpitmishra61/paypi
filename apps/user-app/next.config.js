/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true, // ← treats TS errors as warnings
  },
  eslint: {
    ignoreDuringBuilds: true, // ← same for eslint
  },
};

export default nextConfig;
