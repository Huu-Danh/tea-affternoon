// Thông tin venue: đổi tên, địa chỉ, giờ mở cửa... tại đây.
export const venue = {
  name: "Hilton Saigon",
  lounge: "Me Linh Lounge",
  tagline: "Trà chiều giữa lòng Sài Gòn",
  description:
    "Afternoon Tea phong cách châu Âu tại Me Linh Lounge, Hilton Saigon: trà, món mặn và bánh ngọt trên khay 3 tầng, phục vụ từ 14:00 đến 17:00.",
  address: "Công trường Mê Linh, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
  phone: "+84 28 3823 7979",
  email: "SGNHI_Hotel@Hilton.com",
  hours: "14:00 – 17:00 hằng ngày",
  dressCode: "Smart casual",
  bookingWindowDays: 60,
  holdMinutes: 10,
  serviceChargeRate: 0.05,
  vatRate: 0.08,
  /** Nhạc nền tự phát (xem components/background-music.tsx) */
  music: {
    src: "/music/saturn-3-music-clair-de-lune-debussy-soft-piano-411227.mp3",
    title: "Clair de Lune – Debussy",
    volume: 0.35,
  },
} as const;
