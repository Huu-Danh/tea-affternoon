import Link from "next/link";
import { Check, ChevronDown, Clock, MapPin, Minus, Shirt } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { Illustration, Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { btn, cn, eyebrow } from "@/components/ui";
import { comparison, experiences } from "@/data/experiences";
import { venue } from "@/data/venue";
import { formatVnd } from "@/lib/format";

const faqs = [
  {
    q: "Tôi có cần đặt trước không?",
    a: "Nên đặt trước, đặc biệt vào cuối tuần. Mỗi khung giờ chỉ có số bàn giới hạn để đảm bảo chất lượng phục vụ.",
  },
  {
    q: "Chính sách huỷ và đổi lịch thế nào?",
    a: "Miễn phí huỷ hoặc đổi lịch trước 24 giờ. Huỷ trong vòng 24 giờ trước giờ đặt sẽ không được hoàn tiền.",
  },
  {
    q: "Nhà hàng có phục vụ món chay hoặc không gluten?",
    a: "Có. Vui lòng ghi chú khi đặt chỗ, bếp sẽ chuẩn bị tháp bánh chay, không gluten hoặc không hạt cho bạn.",
  },
  {
    q: "Tôi có thể đặt cho nhóm trên 8 khách?",
    a: `Với nhóm từ 9 khách trở lên hoặc sự kiện riêng, vui lòng liên hệ ${venue.phone} để được sắp xếp không gian phù hợp.`,
  },
  {
    q: "Có quy định trang phục không?",
    a: `${venue.dressCode}. Vui lòng không mặc đồ bơi hoặc dép lê.`,
  },
];

const tiers = [
  {
    art: "stand" as const,
    title: "Món mặn",
    text: "Các món mặn mở đầu buổi trà chiều, trình bày trên khay phục vụ 3 tầng.",
  },
  {
    art: "cup" as const,
    title: "Bánh",
    text: "Các loại bánh theo phong cách trà chiều châu Âu, đi kèm Strawberry Jam và Cream.",
  },
  {
    art: "pot" as const,
    title: "Trà",
    text: "Lựa chọn trà theo khẩu vị, phục vụ cùng bộ tách trà và dụng cụ đi kèm.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative">
        <Photo
          alt="Không gian trà chiều tại sảnh"
          tone="forest"
          art="stand"
          className="h-[calc(100svh-4rem)] min-h-[560px] lg:h-[calc(100svh-5rem)]"
          artClassName="h-[34%] w-auto -translate-y-[60%] opacity-40 lg:mr-[9%] lg:ml-auto lg:h-[62%] lg:translate-y-0"
        >
          <div className="absolute inset-0 bg-linear-to-t from-forest-dark/90 via-forest-dark/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
            <div className="max-w-2xl animate-fade-up text-cream">
              <p className={cn(eyebrow, "text-gold-soft")}>
                {venue.lounge} · {venue.name}
              </p>
              <h1 className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
                {venue.tagline}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/80 sm:text-lg">
                Trà, món mặn và bánh ngọt trên khay 3 tầng, phục vụ tại {venue.lounge} từ 14:00 đến 17:00.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="#experiences" className={btn.gold}>
                  Chọn gói trà chiều
                </Link>
                <Link href="#menu" className={btn.light}>
                  Xem thực đơn
                </Link>
              </div>
            </div>
          </div>
          <a
            href="#info"
            className="absolute bottom-6 right-6 hidden size-11 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition hover:bg-cream/10 lg:flex"
            aria-label="Cuộn xuống"
          >
            <ChevronDown className="size-5" />
          </a>
        </Photo>
      </section>

      {/* INFO STRIP */}
      <section id="info" className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-7xl divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            { icon: Clock, label: "Giờ phục vụ", value: venue.hours },
            { icon: MapPin, label: "Địa điểm", value: venue.lounge },
            { icon: Shirt, label: "Trang phục", value: venue.dressCode },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-6 sm:justify-center sm:px-6">
              <Icon className="size-5 text-gold" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{label}</p>
                <p className="mt-0.5 font-display text-xl">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCES */}
      <section id="experiences" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className={eyebrow}>Trải nghiệm</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Chọn buổi chiều của bạn</h2>
          <p className="mt-5 text-muted">
            Afternoon Tea phong cách châu Âu tại {venue.lounge}: thưởng trà, dùng bánh và món mặn, trò chuyện và thư
            giãn.
          </p>
        </Reveal>
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {experiences.map((exp, i) => (
            <Reveal key={exp.slug} delay={i * 0.08} className="w-full sm:w-104">
              <ExperienceCard exp={exp} index={i} />
            </Reveal>
          ))}
        </div>

        {experiences.length > 1 && (
          <Reveal className="mx-auto mt-20 max-w-4xl">
            <h3 className="text-center font-display text-3xl sm:text-4xl">So sánh hai lựa chọn</h3>
            <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-paper">
              <table className="w-full table-fixed text-left text-sm">
                <caption className="sr-only">So sánh các gói Afternoon Tea</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="w-[34%] p-4 sm:p-6">
                      <span className="sr-only">Hạng mục</span>
                    </th>
                    {experiences.map((e) => (
                      <th key={e.slug} scope="col" className="p-4 align-bottom sm:p-6">
                        <Link href={`/experiences/${e.slug}/`} className="font-display text-xl leading-tight hover:text-forest sm:text-2xl">
                          {e.name}
                        </Link>
                        <p className="mt-1 font-display text-lg text-forest sm:text-xl">{formatVnd(e.pricePerGuest)}</p>
                        <p className="text-xs font-normal text-muted">mỗi khách</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label} className="border-b border-line/70 last:border-0">
                      <th scope="row" className="p-4 font-medium sm:px-6">
                        {row.label}
                      </th>
                      {experiences.map((e) => {
                        const v = row.values[e.slug];
                        return (
                          <td key={e.slug} className="p-4 text-ink/80 sm:px-6">
                            {v === true ? (
                              <Check className="size-5 text-forest" aria-label="Có" />
                            ) : v === false || v === undefined ? (
                              <Minus className="size-5 text-ink/25" aria-label="Không" />
                            ) : (
                              v
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}
      </section>

      {/* STORY */}
      <section className="bg-sand/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32">
          <Reveal>
            <Photo alt="Bộ ấm trà sứ" tone="blush" art="pot" className="aspect-[4/5] rounded-[2rem]" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className={eyebrow}>Câu chuyện</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Trà chiều phong cách châu Âu tại {venue.name}
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                Afternoon Tea tại {venue.name} được phục vụ tại {venue.lounge} trong khung giờ 14:00 – 17:00. Mỗi set
                là sự kết hợp giữa các loại trà, món mặn và bánh ngọt, được trình bày trên khay 3 tầng, đi kèm
                Strawberry Jam, Cream và bộ ấm tách trà.
              </p>
              <p>
                Một buổi chiều để thưởng thức ẩm thực, thư giãn và gặp gỡ trong không gian sang trọng của khách sạn.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                ["3", "tầng khay bánh"],
                ["14:00", "bắt đầu phục vụ"],
                ["17:00", "kết thúc"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-4xl text-forest">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal className="max-w-2xl">
            <p className={cn(eyebrow, "text-gold-soft")}>Thực đơn</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">Ba tầng của một buổi chiều</h2>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-cream/10 md:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.1} className="bg-forest p-8 lg:p-10">
                <Illustration art={t.art} className="size-20 text-gold-soft" />
                <p className="mt-8 font-display text-sm tracking-[0.3em] text-gold-soft">0{i + 1}</p>
                <h3 className="mt-2 font-display text-3xl">{t.title}</h3>
                <p className="mt-4 leading-relaxed text-cream/70">{t.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={`/experiences/${experiences[0].slug}/`} className={btn.light}>
              Xem thực đơn đầy đủ
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className={eyebrow}>Không gian</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">{venue.lounge}</h2>
          </div>
          <p className="max-w-md text-muted">
            Không gian sang trọng của khách sạn, nơi thư giãn và gặp gỡ trong một buổi chiều giữa trung tâm Quận 1.
          </p>
        </Reveal>
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
          <Photo alt="Sảnh chính" tone="forest" art="stand" className="col-span-2 row-span-2 rounded-3xl" />
          <Photo alt="Bàn trà cạnh cửa sổ" tone="blush" art="cup" className="rounded-3xl" />
          <Photo alt="Ấm trà" tone="gold" art="pot" className="rounded-3xl" />
          <Photo alt="Bánh ngọt" tone="ink" art="stand" className="rounded-3xl" />
          <Photo alt="Tách trà" tone="blush" art="cup" className="rounded-3xl" />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-8 lg:py-32">
          <Reveal>
            <p className={eyebrow}>Hỏi đáp</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">Trước khi bạn đến</h2>
            <p className="mt-5 text-muted">
              Cần hỗ trợ thêm? Gọi{" "}
              <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="text-forest underline underline-offset-4">
                {venue.phone}
              </a>
            </p>
          </Reveal>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-2xl">
                  {f.q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-lg transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Photo alt="Trà chiều" tone="gold" art="cup" className="rounded-[2rem]">
          <div className="relative flex flex-col items-start gap-6 bg-linear-to-r from-[#5c4524]/80 to-transparent p-10 text-paper sm:p-16">
            <h2 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl">Dành một buổi chiều cho chính mình</h2>
            <Link href="#experiences" className={cn(btn.primary, "bg-paper text-forest hover:bg-cream")}>
              Đặt chỗ ngay
            </Link>
          </div>
        </Photo>
      </section>
    </>
  );
}
