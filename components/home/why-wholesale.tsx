import { BadgeCheck, Handshake, PackageCheck, Clock } from 'lucide-react'

const REASONS = [
  {
    icon: BadgeCheck,
    title: '35+ Years of Trust',
    description:
      'Serving retailers and distributors since 1989, Selection House has built its reputation on genuine products and honest dealing.',
  },
  {
    icon: Handshake,
    title: 'Real Wholesale Pricing',
    description:
      'Tiered bulk discounts on every product. The more you order, the more you save, with pricing built specifically for shop owners.',
  },
  {
    icon: PackageCheck,
    title: 'Wide Product Range',
    description:
      'From cricket and hockey to gym equipment, school bags, and Yonex badminton gear, everything under one roof.',
  },
  {
    icon: Clock,
    title: 'Reliable Bulk Supply',
    description:
      'Consistent stock availability and dependable delivery timelines, so your shop shelves are never empty.',
  },
]

export function WhyWholesale() {
  return (
    <section className="bg-secondary/50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Why Shop Owners Choose Selection House
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Built for retailers who need a supplier they can rely on
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-card rounded-xl border p-6 flex flex-col items-start gap-3"
            >
              <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-base">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
