/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      type: "json",
      use: "yaml-loader"
    });

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: "graphql-tag/loader"
    });

    return config;
  }
};

module.exports = nextConfig;
