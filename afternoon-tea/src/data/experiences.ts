import type { L } from "@/i18n/config";

export type Tone = "navy" | "blush" | "gold" | "ink";

export type MenuSection = {
  title: L;
  items: L[];
};

export type Experience = {
  slug: string;
  /** Tên gói giữ nguyên tiếng Anh ở cả hai ngôn ngữ */
  name: string;
  tagline: L;
  description: L;
  pricePerGuest: number;
  durationMinutes: number;
  minPax: number;
  maxPax: number;
  /** 0 = Chủ nhật ... 6 = Thứ bảy */
  daysOfWeek: number[];
  timeSlots: string[];
  capacityPerSlot: number;
  badge?: string;
  tone: Tone;
  /** Ảnh thật: đặt file vào public/images/ rồi điền đường dẫn */
  image?: string;
  highlights: L[];
  menu: MenuSection[];
  terms: L[];
  /** Dịch vụ đi kèm: hiện thêm trường/ghi chú tương ứng ở bước checkout */
  perks?: { greetingCard?: boolean; tableDecor?: boolean };
  /** Giá combo 2 người (theo poster ưu đãi). Mỗi cặp khách tính theo giá này. */
  pairPrice?: number;
  /** Poster chương trình ưu đãi */
  offerPoster?: string;
  /** Nhạc nền riêng khi xem trang chi tiết và trong lúc đặt gói này */
  music?: string;
};

// TODO: chính sách mẫu, cần xác nhận với khách sạn
const commonTerms: L[] = [
  {
    vi: "Giá tính theo khách, chưa bao gồm 5% phí phục vụ và 8% VAT.",
    en: "Prices are per guest and exclude a 5% service charge and 8% VAT.",
  },
  { vi: "Thanh toán trước 100% để xác nhận chỗ.", en: "Full prepayment is required to confirm the booking." },
  {
    vi: "Miễn phí huỷ hoặc đổi lịch trước 24 giờ. Huỷ trong vòng 24 giờ không được hoàn tiền.",
    en: "Free cancellation or rescheduling up to 24 hours before. Cancellations within 24 hours are non-refundable.",
  },
  {
    vi: "Vui lòng đến đúng giờ. Bàn được giữ tối đa 15 phút.",
    en: "Please arrive on time. Tables are held for up to 15 minutes.",
  },
];

const trayAndSet: L[] = [
  { vi: "Khay phục vụ 3 tầng", en: "Three-tier serving stand" },
  { vi: "Bộ tách trà và dụng cụ đi kèm", en: "Tea set and accessories" },
];

export const experiences: Experience[] = [
  {
    slug: "european-classic",
    name: "European Classic",
    tagline: { vi: "Afternoon Tea đầy đủ theo cách đơn giản", en: "A complete afternoon tea, simply done" },
    description: {
      vi: "European Classic được xây dựng dành cho khách muốn trải nghiệm Afternoon Tea theo hướng đầy đủ nhưng đơn giản hơn. Gói tập trung vào những giá trị cơ bản của Afternoon Tea: thưởng trà, dùng bánh và món mặn, trò chuyện và thư giãn tại Me Linh Lounge.",
      en: "European Classic is designed for guests who want a complete yet simpler Afternoon Tea experience. It focuses on the essentials of afternoon tea: enjoying tea, pastries and savouries, good conversation and relaxing at Me Linh Lounge.",
    },
    pricePerGuest: 499000,
    pairPrice: 949000,
    offerPoster: "/images/offer-european-classic.webp",
    music: "/music/european-classic.mp3",
    // TODO: thời lượng, số khách và sức chứa là giá trị mẫu, cần xác nhận
    durationMinutes: 120,
    minPax: 1,
    maxPax: 8,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    // Khung phục vụ 14:00–17:00, mỗi lượt 2 giờ
    timeSlots: ["14:00", "14:30", "15:00"],
    capacityPerSlot: 12,
    tone: "navy",
    image: "/images/european-classic.webp",
    highlights: [
      { vi: "1 lựa chọn trà", en: "1 choice of tea" },
      { vi: "2 món mặn", en: "2 savouries" },
      { vi: "3 loại bánh", en: "3 pastries" },
      ...trayAndSet,
      { vi: "Không gian thưởng thức tại Me Linh Lounge", en: "Served at Me Linh Lounge" },
    ],
    menu: [
      { title: { vi: "Trà", en: "Tea" }, items: [{ vi: "1 lựa chọn trà", en: "1 choice of tea" }] },
      { title: { vi: "Món mặn", en: "Savouries" }, items: [{ vi: "2 món mặn", en: "2 savouries" }] },
      { title: { vi: "Bánh", en: "Pastries" }, items: [{ vi: "3 loại bánh", en: "3 pastries" }] },
      { title: { vi: "Phục vụ", en: "Service" }, items: trayAndSet },
    ],
    terms: commonTerms,
  },
  {
    slug: "european-premium",
    name: "European Premium",
    tagline: {
      vi: "Nguyên liệu cao cấp hơn, thêm bánh và dịch vụ đi kèm",
      en: "Finer ingredients, more pastries and extra touches",
    },
    description: {
      vi: "European Premium dành cho khách muốn một buổi Afternoon Tea trọn vẹn hơn: món mặn dùng nguyên liệu cao cấp như cá hồi xông khói và trứng cá, thêm nhiều loại bánh như macaron, chocolate éclair và raspberry mousse cake, lựa chọn trà hoa cúc bên cạnh trà Earl Grey, cùng welcome drink. Với khách có dịp đặc biệt, nhóm có thể chuẩn bị thiệp chúc mừng và trang trí bàn.",
      en: "European Premium is for guests who want a fuller Afternoon Tea: savouries made with finer ingredients such as smoked salmon and caviar, more pastries including macarons, chocolate éclairs and raspberry mousse cake, a choice of chamomile alongside Earl Grey, and a welcome drink. For special occasions, a greeting card and table decoration can be prepared.",
    },
    pricePerGuest: 599000,
    pairPrice: 1139000,
    offerPoster: "/images/offer-european-premium.webp",
    music: "/music/european-premium.mp3",
    // TODO: thời lượng, số khách và sức chứa là giá trị mẫu, cần xác nhận
    durationMinutes: 120,
    minPax: 1,
    maxPax: 8,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["14:00", "14:30", "15:00"],
    capacityPerSlot: 8,
    badge: "Premium",
    tone: "gold",
    image: "/images/european-premium.webp",
    highlights: [
      { vi: "Welcome drink", en: "Welcome drink" },
      { vi: "Trà Earl Grey hoặc trà hoa cúc", en: "Earl Grey or chamomile tea" },
      { vi: "Món mặn với cá hồi xông khói và trứng cá", en: "Savouries with smoked salmon and caviar" },
      {
        vi: "Thêm macaron, chocolate éclair và raspberry mousse cake",
        en: "Extra macarons, chocolate éclairs and raspberry mousse cake",
      },
      { vi: "Thiệp chúc mừng theo yêu cầu", en: "Greeting card on request" },
      { vi: "Trang trí bàn cho khách có dịp đặc biệt", en: "Table decoration for special occasions" },
    ],
    menu: [
      { title: { vi: "Welcome drink", en: "Welcome drink" }, items: [{ vi: "Đồ uống chào mừng", en: "A welcome drink" }] },
      {
        title: { vi: "Trà", en: "Tea" },
        items: [
          { vi: "Earl Grey", en: "Earl Grey" },
          { vi: "Trà hoa cúc", en: "Chamomile" },
        ],
      },
      {
        title: { vi: "Món mặn", en: "Savouries" },
        items: [
          { vi: "Cá hồi xông khói", en: "Smoked salmon" },
          { vi: "Trứng cá", en: "Caviar" },
        ],
      },
      {
        title: { vi: "Bánh", en: "Pastries" },
        items: [
          { vi: "Macaron", en: "Macarons" },
          { vi: "Chocolate éclair", en: "Chocolate éclair" },
          { vi: "Raspberry mousse cake", en: "Raspberry mousse cake" },
        ],
      },
      {
        title: { vi: "Phục vụ", en: "Service" },
        items: [
          ...trayAndSet,
          { vi: "Thiệp chúc mừng (theo yêu cầu)", en: "Greeting card (on request)" },
          { vi: "Trang trí bàn cho dịp đặc biệt", en: "Table decoration for special occasions" },
        ],
      },
    ],
    terms: commonTerms,
    perks: { greetingCard: true, tableDecor: true },
  },
];

/** Bảng so sánh các gói trên trang chủ (theo thông tin sản phẩm) */
export const comparison: { label: L; values: Record<string, L | boolean> }[] = [
  {
    label: { vi: "Trà", en: "Tea" },
    values: {
      "european-classic": { vi: "1 lựa chọn trà", en: "1 choice of tea" },
      "european-premium": { vi: "Earl Grey hoặc trà hoa cúc", en: "Earl Grey or chamomile" },
    },
  },
  {
    label: { vi: "Món mặn", en: "Savouries" },
    values: {
      "european-classic": { vi: "2 món mặn", en: "2 savouries" },
      "european-premium": {
        vi: "Nguyên liệu cao cấp: cá hồi xông khói, trứng cá",
        en: "Finer ingredients: smoked salmon, caviar",
      },
    },
  },
  {
    label: { vi: "Bánh", en: "Pastries" },
    values: {
      "european-classic": { vi: "3 loại bánh", en: "3 pastries" },
      "european-premium": {
        vi: "Thêm macaron, chocolate éclair, raspberry mousse cake",
        en: "Plus macarons, chocolate éclair, raspberry mousse cake",
      },
    },
  },
  {
    label: { vi: "Khay 3 tầng & bộ tách trà", en: "Three-tier stand & tea set" },
    values: { "european-classic": true, "european-premium": true },
  },
  { label: { vi: "Welcome drink", en: "Welcome drink" }, values: { "european-classic": false, "european-premium": true } },
  { label: { vi: "Thiệp chúc mừng", en: "Greeting card" }, values: { "european-classic": false, "european-premium": true } },
  {
    label: { vi: "Trang trí bàn dịp đặc biệt", en: "Occasion table decoration" },
    values: { "european-classic": false, "european-premium": true },
  },
];

export function getExperience(slug: string) {
  return experiences.find((e) => e.slug === slug);
}

export function addonsFor(slug: string) {
  return addons.filter((a) => !a.hiddenFor?.includes(slug));
}

export type Addon = {
  id: string;
  name: L;
  description: L;
  price: number;
  maxQty: number;
  /** Ẩn với các gói đã bao gồm dịch vụ này */
  hiddenFor?: string[];
};

// TODO: add-on mẫu, chưa có trong thông tin sản phẩm thật
export const addons: Addon[] = [
  {
    id: "champagne",
    name: { vi: "Thêm ly Champagne", en: "Glass of Champagne" },
    description: { vi: "Một ly Champagne 125ml", en: "One 125 ml glass of Champagne" },
    price: 390000,
    maxQty: 8,
  },
  {
    id: "cake",
    name: { vi: "Bánh kem kỷ niệm", en: "Celebration cake" },
    description: { vi: "Bánh 12cm, ghi lời chúc theo yêu cầu", en: "12 cm cake with a personalised message" },
    price: 450000,
    maxQty: 1,
  },
  {
    id: "flowers",
    name: { vi: "Hoa tươi trang trí bàn", en: "Fresh table flowers" },
    description: { vi: "Bình hoa nhỏ theo mùa", en: "A small seasonal bouquet" },
    price: 350000,
    maxQty: 1,
    hiddenFor: ["european-premium"],
  },
  {
    id: "giftbox",
    name: { vi: "Hộp trà quà tặng", en: "Tea gift box" },
    description: { vi: "Hộp 3 loại trà Việt, đóng hộp quà", en: "Three Vietnamese teas in a gift box" },
    price: 520000,
    maxQty: 4,
  },
];

/** Dịp đặc biệt: lưu theo khoá, hiển thị theo từ điển (dict.occasions) */
export const occasionKeys = ["none", "birthday", "anniversary", "date", "business", "other"] as const;
