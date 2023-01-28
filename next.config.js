/** @type {import('next').NextConfig} */

const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.resolve = {
      alias: {
        '@hooks/*': path.resolve(__dirname, '/hooks'),
        '@components/*': path.resolve(__dirname, '/components'),
        '@layouts/*': path.resolve(__dirname, '/layouts'),
        '@pages/*': path.resolve(__dirname, '/pages'),
        '@utils/*': path.resolve(__dirname, '/utils'),
        '@typings': path.resolve(__dirname, '/typings'),
      },
      ...config.resolve,
    };
    return config;
  },
};
