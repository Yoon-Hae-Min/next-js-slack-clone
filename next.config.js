/** @type {import('next').NextConfig} */

const path = require('path');

module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signin',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
  webpack: (config, { webpack }) => {
    config.resolve = {
      alias: {
        '@hooks/*': path.resolve(__dirname, '/hooks'),
        '@components/*': path.resolve(__dirname, '/components'),
        '@layouts/*': path.resolve(__dirname, '/layouts'),
        '@pages/*': path.resolve(__dirname, '/pages'),
        '@utils/*': path.resolve(__dirname, '/utils'),
        '@types/*': path.resolve(__dirname, '/types'),
        '@apis/*': path.resolve(__dirname, '/apis'),
      },
      ...config.resolve,
    };
    return config;
  },
};
