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
};

const commonTerms = [
  "Giá tính theo khách, chưa bao gồm 5% phí phục vụ và 8% VAT.",
  "Thanh toán trước 100% để xác nhận chỗ.",
  "Miễn phí huỷ hoặc đổi lịch trước 24 giờ. Huỷ trong vòng 24 giờ không được hoàn tiền.",
  "Vui lòng đến đúng giờ. Bàn được giữ tối đa 15 phút.",
];

export const experiences: Experience[] = [
  {
    slug: "classic-afternoon-tea",
    name: "Classic Afternoon Tea",
    tagline: "Tháp bánh ba tầng truyền thống kiểu Anh",
    description:
      "Bộ trà chiều kinh điển với sandwich, bánh scone nướng mỗi giờ, kem đông Devon và bánh ngọt thủ công của bếp trưởng bánh. Đi kèm trà tuyển chọn từ các vườn trà Việt Nam và thế giới, phục vụ không giới hạn.",
    pricePerGuest: 690000,
    durationMinutes: 120,
    minPax: 1,
    maxPax: 8,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["14:00", "14:30", "15:00", "15:30", "16:00"],
    capacityPerSlot: 12,
    badge: "Bán chạy",
    tone: "forest",
    highlights: [
      "Tháp bánh 3 tầng: 4 loại savoury, 2 loại scone, 5 loại bánh ngọt",
      "Trà tuyển chọn phục vụ không giới hạn",
      "Thời gian thưởng thức 2 giờ",
    ],
    menu: [
      {
        title: "Savouries",
        items: [
          "Sandwich dưa leo, phô mai kem và thì là",
          "Trứng truffle trên bánh brioche",
          "Cá hồi xông khói, kem chanh",
          "Bánh tart nấm và phô mai Gruyère",
        ],
      },
      {
        title: "Scones",
        items: [
          "Scone bơ truyền thống",
          "Scone nho khô",
          "Kem đông Devon, mứt dâu Đà Lạt, lemon curd",
        ],
      },
      {
        title: "Sweets",
        items: [
          "Éclair vani Madagascar",
          "Tart chanh dây và meringue",
          "Mousse sô-cô-la Marou 70%",
          "Macaron hoa hồng",
          "Bánh opera trà xanh",
        ],
      },
    ],
    terms: commonTerms,
  },
  {
    slug: "champagne-afternoon-tea",
    name: "Champagne Afternoon Tea",
    tagline: "Trà chiều cổ điển kèm một ly Champagne",
    description:
      "Toàn bộ thực đơn Classic Afternoon Tea, nâng tầm với một ly Champagne Moët & Chandon Brut Impérial cho mỗi khách. Lựa chọn lý tưởng cho dịp kỷ niệm, sinh nhật hay một buổi chiều thật đặc biệt.",
    pricePerGuest: 1190000,
    durationMinutes: 120,
    minPax: 2,
    maxPax: 8,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["14:00", "14:30", "15:00", "15:30", "16:00"],
    capacityPerSlot: 8,
    badge: "Dịp đặc biệt",
    tone: "gold",
    highlights: [
      "Một ly Champagne cho mỗi khách",
      "Toàn bộ thực đơn Classic Afternoon Tea",
      "Ưu tiên bàn cạnh cửa sổ (tuỳ tình trạng)",
    ],
    menu: [
      { title: "Welcome", items: ["Moët & Chandon Brut Impérial (1 ly/khách)"] },
      {
        title: "Savouries",
        items: [
          "Sandwich dưa leo, phô mai kem và thì là",
          "Trứng truffle trên bánh brioche",
          "Cá hồi xông khói, kem chanh",
          "Bánh tart nấm và phô mai Gruyère",
        ],
      },
      {
        title: "Scones & Sweets",
        items: [
          "Scone bơ và scone nho khô",
          "Kem đông Devon, mứt dâu Đà Lạt",
          "Éclair vani, tart chanh dây, macaron hoa hồng",
        ],
      },
    ],
    terms: [...commonTerms, "Đồ uống có cồn chỉ phục vụ khách từ 18 tuổi."],
  },
  {
    slug: "lotus-heritage-tea",
    name: "Lotus Heritage Tea",
    tagline: "Trà chiều cảm hứng bánh trái miền Nam",
    description:
      "Một cách kể lại trà chiều bằng hương vị Việt: trà sen Tây Hồ, bánh da lợn lá dứa, bánh bò nướng, chè hạt sen và những món mặn cuốn tinh tế. Chỉ phục vụ cuối tuần với số lượng giới hạn.",
    pricePerGuest: 790000,
    durationMinutes: 120,
    minPax: 2,
    maxPax: 6,
    daysOfWeek: [0, 6],
    timeSlots: ["14:00", "15:00", "16:00"],
    capacityPerSlot: 6,
    badge: "Cuối tuần",
    tone: "blush",
    highlights: [
      "Trà sen ướp thủ công theo cách truyền thống",
      "9 món bánh mặn ngọt lấy cảm hứng ẩm thực Việt",
      "Chỉ phục vụ Thứ bảy và Chủ nhật",
    ],
    menu: [
      {
        title: "Món mặn",
        items: ["Gỏi cuốn tôm thịt, sốt me", "Bánh khọt mini", "Chả giò cua", "Bánh mì pa-tê nướng mini"],
      },
      {
        title: "Bánh ngọt",
        items: ["Bánh da lợn lá dứa", "Bánh bò nướng nước cốt dừa", "Bánh chuối nướng", "Chè hạt sen long nhãn"],
      },
      { title: "Trà", items: ["Trà sen Tây Hồ", "Trà Shan tuyết cổ thụ Hà Giang", "Trà ô long Bảo Lộc"] },
    ],
    terms: commonTerms,
  },
  {
    slug: "little-royals-tea",
    name: "Little Royals Tea",
    tagline: "Bộ trà chiều dành cho bé từ 4 đến 12 tuổi",
    description:
      "Những chiếc bánh nhỏ xinh, sô-cô-la nóng và nước ép trái cây tươi trong bộ ấm chén dành riêng cho các bé. Bé nhận thêm một món quà nhỏ khi ra về. Đặt kèm cùng người lớn để có trải nghiệm trọn vẹn.",
    pricePerGuest: 390000,
    durationMinutes: 90,
    minPax: 1,
    maxPax: 6,
    daysOfWeek: [0, 6],
    timeSlots: ["14:00", "15:00", "16:00"],
    capacityPerSlot: 8,
    tone: "ink",
    highlights: ["Bánh nhỏ, sandwich và trái cây cho bé", "Sô-cô-la nóng hoặc nước ép tươi", "Quà tặng mang về"],
    menu: [
      { title: "Savouries", items: ["Sandwich gà và mayo", "Mini hot dog", "Pizza nhỏ phô mai"] },
      { title: "Sweets", items: ["Cupcake cầu vồng", "Bánh quy bơ hình gấu", "Kem vani"] },
      { title: "Đồ uống", items: ["Sô-cô-la nóng", "Nước cam ép", "Sữa dâu"] },
    ],
    terms: [...commonTerms, "Dành cho trẻ từ 4 đến 12 tuổi, có người lớn đi kèm."],
  },
];

export function getExperience(slug: string) {
  return experiences.find((e) => e.slug === slug);
}

export type Addon = {
  id: string;
  name: string;
  description: string;
  price: number;
  maxQty: number;
};

export const addons: Addon[] = [
  {
    id: "champagne",
    name: "Thêm ly Champagne",
    description: "Moët & Chandon Brut Impérial, 125ml",
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
