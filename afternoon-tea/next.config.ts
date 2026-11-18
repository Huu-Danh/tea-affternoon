import type { NextConfig } from "next";

// Frontend-only: build ra HTML/CSS/JS tĩnh trong thư mục `out/`,
// deploy được lên bất kỳ static host nào (IIS, Nginx, Vercel, Netlify...).
// Khi deploy lên GitHub Pages, site nằm ở /<tên-repo>/. CI truyền giá trị này
// qua NEXT_PUBLIC_BASE_PATH; chạy local thì để trống.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
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
