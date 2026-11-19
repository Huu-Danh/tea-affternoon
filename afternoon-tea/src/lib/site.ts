/**
 * URL gốc của site (dùng cho ảnh chia sẻ Open Graph, sitemap...). Mạng xã hội cần URL tuyệt đối.
 * Ưu tiên NEXT_PUBLIC_SITE_URL; khi build trên Vercel thì lấy domain production Vercel cung cấp.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
