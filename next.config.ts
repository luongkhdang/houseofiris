/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dvmpwccjw/**', // Adjust for your cloud name
      },
    ],
  },
};

module.exports = nextConfig;
