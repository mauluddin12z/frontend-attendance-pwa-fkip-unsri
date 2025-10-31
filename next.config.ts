import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
      return [
         {
            source: "/api/:path*",
            destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
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

   turbopack: {
      rules: {
         "*.svg": {
            loaders: ["@svgr/webpack"],
            as: "*.js",
         },
      }
   },
};

export default nextConfig;
