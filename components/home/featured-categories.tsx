import Link from 'next/link'
import {
  Dumbbell,
  ShoppingBag,
  Bike,
  Baby,
  Trophy,
  Gamepad2,
  ShieldPlus,
  Shirt,
  Backpack,
} from 'lucide-react'

const FEATURED_CATEGORIES = [
  { name: 'Cricket Items', slug: 'cricket-items', icon: Trophy },
  { name: 'Hockey', slug: 'hockey', icon: Trophy },
  { name: 'Basketball', slug: 'basketball', icon: Trophy },
  { name: 'Running Shoes', slug: 'running-shoes', icon: ShoppingBag },
  { name: 'Yonex', slug: 'yonex', icon: Trophy },
  { name: 'Gym Equipment and Weight', slug: 'gym-equipment-weight', icon: Dumbbell },
  { name: 'Bikes and Treadmill', slug: 'bikes-treadmill', icon: Bike },
  { name: 'School Bags and Trolley Bags', slug: 'school-bags-trolley-bags', icon: Backpack },
  { name: 'Baby Products', slug: 'baby-products', icon: Baby },
  { name: 'Indoor Games', slug: 'indoor-games', icon: Gamepad2 },
  { name: 'Knee Cap and Support', slug: 'knee-cap-support', icon: ShieldPlus },
  { name: 'Ladies Sports Wear', slug: 'ladies-sports-wear', icon: Shirt },
]

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Shop by Category</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Everything a sports goods shop needs, in one place
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {FEATURED_CATEGORIES.map(({ name, slug, icon: Icon }) => (
          <Link
            key={slug}
            href={`/shop/${slug}`}
            className="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all"
          >
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
              <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-center leading-tight">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
