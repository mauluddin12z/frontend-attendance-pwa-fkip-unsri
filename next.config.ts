import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
      return [
         {
            source: "/api/:path*",
            destination: "http://192.168.0.105:5000/:path*",
         },
      ];
   },
   // This is required to support PostHog trailing slash API requests
   skipTrailingSlashRedirect: true,

   webpack(config) {
      config.module.rules.push({
         test: /\.svg$/,
         use: [
            {
               loader: "@svgr/webpack",
               options: {
                  icon: true,
               },
            },
         ],
      });
      return config;
   },

   experimental: {
      turbo: {
         rules: {
            "*.svg": {
               loaders: ["@svgr/webpack"],
               as: "*.js",
            },
         },
      },
   },
};

export default nextConfig;
