/** @type {import('next').NextConfig} */
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const { withPlaiceholder } = require("@plaiceholder/next");
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
// });

module.exports = withPlaiceholder({
  basePath: "/blog",
  webpack(config) {
    config.plugins.push(new WindiCSSWebpackPlugin());
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: [
      "www.anzifan.com",
      "s9lhotbvn.hb-bkt.clouddn.com",
      "static.anzifan.com",
      "cdn.sspai.com",
      "cdn.dribbble.com",
      "image.freepik.com",
      "avatars.githubusercontent.com",
      "prod-files-secure.s3.us-west-2.amazonaws.com",
      "cdn.jsdelivr.net",
      "image.cugxuan.cn",
      "blog-static.mikuchan.top",
      "amazonaws.com",
      "img.zhheo.com",
      "www.aohuiliu.fun",
      "rxhsk.xicp.fun",
      "www.notion.so",
      "www.fomal.cc",
    ],
  },
});
