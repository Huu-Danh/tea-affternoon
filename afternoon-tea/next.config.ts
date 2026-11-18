import type { NextConfig } from "next";

// Frontend-only: build ra HTML/CSS/JS tĩnh trong thư mục `out/`,
// deploy được lên bất kỳ static host nào (IIS, Nginx, Vercel, Netlify...).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
