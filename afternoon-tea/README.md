# Afternoon Tea – Landing page & đặt chỗ (frontend demo)

Landing page bán gói trà chiều kèm luồng đặt chỗ kiểu SevenRooms. **Chỉ có frontend**: dữ liệu mẫu nằm trong code, đặt chỗ lưu ở `localStorage`, thanh toán là giả lập.

## Công nghệ

- **Next.js 16** (App Router, `output: "export"`): build ra HTML tĩnh
- **TypeScript**, **Tailwind CSS v4**
- **Zustand** (+ persist localStorage): state đặt chỗ qua các bước
- **react-hook-form + zod**: form thông tin khách
- **date-fns**: lịch, định dạng ngày tiếng Việt
- **motion**: hiệu ứng; **lucide-react**: icon

## Chạy

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # xuất site tĩnh ra thư mục out/
```

Có thể deploy thư mục `out/` lên IIS, Nginx, Vercel, Netlify...

## CI/CD (GitHub Actions + Vercel)

Workflow: `.github/workflows/ci-cd.yml` (ở gốc repo).

| Sự kiện | Job |
|---|---|
| Mọi push, mọi pull request | `ci`: `npm ci` → lint → typecheck → build |
| Pull request (cùng repo) | `deploy-preview`: deploy bản Preview lên Vercel, URL hiện trong tab Actions và environment `preview` |
| Push vào `master` | `deploy-production`: deploy Production lên Vercel |

Deploy chỉ chạy khi job `ci` qua. Workflow dùng Vercel CLI (`vercel pull` → `vercel build` → `vercel deploy --prebuilt`). `vercel.json` tắt chế độ tự deploy theo Git của Vercel để không deploy trùng.

### Cài đặt một lần

1. Tạo project trên Vercel, đặt **Root Directory = `afternoon-tea`**, Framework Preset là **Next.js**.
2. Tạo token tại vercel.com/account/tokens.
3. Lấy `orgId` và `projectId`: chạy `npx vercel link` ở gốc repo rồi xem file `.vercel/project.json`. Có thể lấy `projectId` ở Project Settings → General.
4. Trên GitHub, vào repo **Settings → Secrets and variables → Actions** và thêm 3 secret: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

### Base path (tuỳ chọn)

Trên Vercel site chạy ở domain gốc nên không cần base path. Nếu sau này deploy dưới đường dẫn con (ví dụ virtual directory trên IIS), đặt biến `NEXT_PUBLIC_BASE_PATH=/ten-thu-muc` khi build. Đường dẫn viết tay tới file trong `public/` cần đi qua `withBasePath()` trong `src/lib/base-path.ts`.

Lưu ý: build trên Windows sinh sai tên các file prefetch `__next.<segment>.__PAGE__.txt` (thành thư mục lồng nhau), nên trình duyệt báo 404 khi prefetch. Đây là lỗi của Next.js trên Windows. Build trên Linux (CI, Vercel) không gặp lỗi này.

## Luồng

`/` → `/experiences/[slug]` (chọn số khách, ngày, giờ) → `/checkout` (thông tin + add-on, giữ chỗ 10 phút) → `/payment` (VNPay / MoMo / thẻ, giả lập) → `/confirmation` (mã đặt chỗ, tải .ics) → `/my-bookings` (xem, huỷ)

## Tuỳ chỉnh

| Muốn đổi | Sửa ở |
|---|---|
| Tên venue, địa chỉ, giờ, phí phục vụ, VAT, thời gian giữ chỗ | `src/data/venue.ts` |
| Gói trà chiều, giá, khung giờ, thực đơn, add-on | `src/data/experiences.ts` |
| Ảnh thật | Đặt ảnh vào `public/images/`, điền `image: "/images/xxx.jpg"` cho từng gói |
| Màu sắc, font | `src/app/globals.css` (`@theme`), `src/app/layout.tsx` |
| Tình trạng chỗ trống (đang giả lập) | `src/lib/availability.ts` |

## Khi nối backend

- `getSlots()` trong `src/lib/availability.ts` → gọi `GET /availability`
- `startHold()` / `confirm()` trong `src/lib/store.ts` → `POST /holds`, `POST /bookings`
- Nút thanh toán trong `src/app/payment/payment-view.tsx` → redirect sang cổng VNPay/MoMo thật, xử lý IPN ở backend
