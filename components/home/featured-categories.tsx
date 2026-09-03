import Link from 'next/link'
import Image from 'next/image'
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
import { placeholderImage } from '@/lib/placeholder-image'

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
            className="group relative flex flex-col items-center gap-2 rounded-xl border bg-card overflow-hidden hover:border-primary hover:shadow-md transition-all"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={placeholderImage(slug, 300, 300)}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 h-8 w-8 rounded-full bg-primary/90 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-medium text-center leading-tight px-2 pb-3">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
