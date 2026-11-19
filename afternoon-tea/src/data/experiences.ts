export type Tone = "forest" | "blush" | "gold" | "ink";

export type MenuSection = {
  title: string;
  items: string[];
};

export type Experience = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
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
  /** Ảnh thật: đặt file vào public/images/ rồi điền đường dẫn, vd "/images/classic.jpg" */
  image?: string;
  highlights: string[];
  menu: MenuSection[];
  terms: string[];
  /** Dịch vụ đi kèm: hiện thêm trường/ghi chú tương ứng ở bước checkout */
  perks?: { greetingCard?: boolean; tableDecor?: boolean };
};

// TODO: chính sách mẫu, cần xác nhận với khách sạn
const commonTerms = [
  "Giá tính theo khách, chưa bao gồm 5% phí phục vụ và 8% VAT.",
  "Thanh toán trước 100% để xác nhận chỗ.",
  "Miễn phí huỷ hoặc đổi lịch trước 24 giờ. Huỷ trong vòng 24 giờ không được hoàn tiền.",
  "Vui lòng đến đúng giờ. Bàn được giữ tối đa 15 phút.",
];

export const experiences: Experience[] = [
  {
    slug: "european-classic",
    name: "European Classic",
    tagline: "Afternoon Tea đầy đủ theo cách đơn giản",
    description:
      "European Classic được xây dựng dành cho khách muốn trải nghiệm Afternoon Tea theo hướng đầy đủ nhưng đơn giản hơn. Gói tập trung vào những giá trị cơ bản của Afternoon Tea: thưởng trà, dùng bánh và món mặn, trò chuyện và thư giãn tại Me Linh Lounge.",
    pricePerGuest: 499000,
    // TODO: thời lượng, số khách và sức chứa là giá trị mẫu, cần xác nhận
    durationMinutes: 120,
    minPax: 1,
    maxPax: 8,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    // Khung phục vụ 14:00–17:00, mỗi lượt 2 giờ
    timeSlots: ["14:00", "14:30", "15:00"],
    capacityPerSlot: 12,
    tone: "forest",
    image: "/images/european-classic.jpg",
    highlights: [
      "1 lựa chọn trà",
      "2 món mặn",
      "3 loại bánh",
      "Khay phục vụ 3 tầng",
      "Bộ tách trà và dụng cụ đi kèm",
      "Không gian thưởng thức tại Me Linh Lounge",
    ],
    menu: [
      { title: "Trà", items: ["1 lựa chọn trà"] },
      { title: "Món mặn", items: ["2 món mặn"] },
      { title: "Bánh", items: ["3 loại bánh"] },
      { title: "Phục vụ", items: ["Khay phục vụ 3 tầng", "Bộ tách trà và dụng cụ đi kèm"] },
    ],
    terms: commonTerms,
  },
  {
    slug: "european-premium",
    name: "European Premium",
    tagline: "Nguyên liệu cao cấp hơn, thêm bánh và dịch vụ đi kèm",
    description:
      "European Premium dành cho khách muốn một buổi Afternoon Tea trọn vẹn hơn: món mặn dùng nguyên liệu cao cấp như cá hồi xông khói và trứng cá, thêm nhiều loại bánh như macaron, chocolate éclair và raspberry mousse cake, lựa chọn trà hoa cúc bên cạnh trà Earl Grey, cùng welcome drink. Với khách có dịp đặc biệt, nhóm có thể chuẩn bị thiệp chúc mừng và trang trí bàn.",
    pricePerGuest: 599000,
    // TODO: thời lượng, số khách và sức chứa là giá trị mẫu, cần xác nhận
    durationMinutes: 120,
    minPax: 1,
    maxPax: 8,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["14:00", "14:30", "15:00"],
    capacityPerSlot: 8,
    badge: "Premium",
    tone: "gold",
    image: "/images/european-premium.jpg",
    highlights: [
      "Welcome drink",
      "Trà Earl Grey hoặc trà hoa cúc",
      "Món mặn với cá hồi xông khói và trứng cá",
      "Thêm macaron, chocolate éclair và raspberry mousse cake",
      "Thiệp chúc mừng theo yêu cầu",
      "Trang trí bàn cho khách có dịp đặc biệt",
    ],
    menu: [
      { title: "Welcome drink", items: ["Đồ uống chào mừng"] },
      { title: "Trà", items: ["Earl Grey", "Trà hoa cúc"] },
      { title: "Món mặn", items: ["Cá hồi xông khói", "Trứng cá"] },
      { title: "Bánh", items: ["Macaron", "Chocolate éclair", "Raspberry mousse cake"] },
      {
        title: "Phục vụ",
        items: [
          "Khay phục vụ 3 tầng",
          "Bộ tách trà và dụng cụ đi kèm",
          "Thiệp chúc mừng (theo yêu cầu)",
          "Trang trí bàn cho dịp đặc biệt",
        ],
      },
    ],
    terms: commonTerms,
    perks: { greetingCard: true, tableDecor: true },
  },
];

/** Bảng so sánh các gói trên trang chủ (theo thông tin sản phẩm) */
export const comparison: { label: string; values: Record<string, string | boolean> }[] = [
  { label: "Trà", values: { "european-classic": "1 lựa chọn trà", "european-premium": "Earl Grey hoặc trà hoa cúc" } },
  {
    label: "Món mặn",
    values: { "european-classic": "2 món mặn", "european-premium": "Nguyên liệu cao cấp: cá hồi xông khói, trứng cá" },
  },
  {
    label: "Bánh",
    values: {
      "european-classic": "3 loại bánh",
      "european-premium": "Thêm macaron, chocolate éclair, raspberry mousse cake",
    },
  },
  { label: "Khay 3 tầng & bộ tách trà", values: { "european-classic": true, "european-premium": true } },
  { label: "Welcome drink", values: { "european-classic": false, "european-premium": true } },
  { label: "Thiệp chúc mừng", values: { "european-classic": false, "european-premium": true } },
  { label: "Trang trí bàn dịp đặc biệt", values: { "european-classic": false, "european-premium": true } },
];

export function getExperience(slug: string) {
  return experiences.find((e) => e.slug === slug);
}

export function addonsFor(slug: string) {
  return addons.filter((a) => !a.hiddenFor?.includes(slug));
}

export type Addon = {
  id: string;
  name: string;
  description: string;
  price: number;
  maxQty: number;
  /** Ẩn với các gói đã bao gồm dịch vụ này */
  hiddenFor?: string[];
};

// TODO: add-on mẫu, chưa có trong thông tin sản phẩm thật
export const addons: Addon[] = [
  {
    id: "champagne",
    name: "Thêm ly Champagne",
    description: "Một ly Champagne 125ml",
    price: 390000,
    maxQty: 8,
  },
  {
    id: "cake",
    name: "Bánh kem kỷ niệm",
    description: "Bánh 12cm, ghi lời chúc theo yêu cầu",
    price: 450000,
    maxQty: 1,
  },
  {
    id: "flowers",
    name: "Hoa tươi trang trí bàn",
    description: "Bình hoa nhỏ theo mùa",
    price: 350000,
    maxQty: 1,
    hiddenFor: ["european-premium"],
  },
  {
    id: "giftbox",
    name: "Hộp trà quà tặng",
    description: "Hộp 3 loại trà Việt, đóng hộp quà",
    price: 520000,
    maxQty: 4,
  },
];

export const occasions = ["Không có", "Sinh nhật", "Kỷ niệm", "Hẹn hò", "Gặp gỡ công việc", "Khác"] as const;
