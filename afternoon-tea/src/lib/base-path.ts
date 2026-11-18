/**
 * next/link và router tự thêm basePath, nhưng thẻ <img> và URL viết tay thì không.
 * Dùng hàm này cho mọi đường dẫn tới file trong public/.
 */
export function withBasePath(src: string) {
  return src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
}
