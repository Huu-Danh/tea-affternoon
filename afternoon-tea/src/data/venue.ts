// Thông tin venue: đổi tên, địa chỉ, giờ mở cửa... tại đây.
// Trường có { vi, en } là chuỗi song ngữ, lấy bằng tr(field, lang).
export const venue = {
  name: "Hilton Saigon",
  lounge: "Me Linh Lounge",
  tagline: { vi: "Trà chiều giữa lòng Sài Gòn", en: "Afternoon tea in the heart of Saigon" },
  address: {
    vi: "Công trường Mê Linh, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
    en: "Me Linh Square, District 1, Ho Chi Minh City, Vietnam",
  },
  phone: "+84 28 3823 7979",
  email: "SGNHI_Hotel@Hilton.com",
  hours: { vi: "14:00 – 17:00 hằng ngày", en: "Daily, 2:00 – 5:00 PM" },
  dressCode: { vi: "Smart casual", en: "Smart casual" },
  bookingWindowDays: 60,
  holdMinutes: 10,
  serviceChargeRate: 0.05,
  vatRate: 0.08,
  /** Voucher quà tặng có hiệu lực bao nhiêu tháng */
  voucherValidityMonths: 6,
  /** Nhạc nền tự phát (xem components/background-music.tsx) */
  music: {
    src: "/music/clair-de-lune.mp3",
    title: "Clair de Lune – Debussy",
    /**
     * 0 → 1 (1 là tối đa của trình duyệt). Các file nhạc đã được chuẩn hoá
     * cùng độ to -16 LUFS nên một mức âm lượng dùng chung cho mọi bài.
     */
    volume: 0.6,
  },
} as const;
