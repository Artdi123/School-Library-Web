/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
