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
