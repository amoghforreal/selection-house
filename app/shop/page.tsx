import Link from 'next/link'
import type { Metadata } from 'next'
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
  Footprints,
  Printer,
  School,
  PersonStanding,
  Puzzle,
  CircleDot,
  Volleyball,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop All Categories',
  description:
    'Browse all wholesale sports goods categories at Selection House, from cricket and hockey to gym equipment and school bags.',
}

const ALL_CATEGORIES = [
  { name: 'Hockey', slug: 'hockey', icon: Trophy },
  { name: 'Cricket Items', slug: 'cricket-items', icon: Trophy },
  { name: 'Basketball', slug: 'basketball', icon: CircleDot },
  { name: 'Running Shoes', slug: 'running-shoes', icon: Footprints },
  { name: 'School Bags and Trolley Bags', slug: 'school-bags-trolley-bags', icon: Backpack },
  { name: 'Skating', slug: 'skating', icon: PersonStanding },
  { name: 'Knee Cap and Support', slug: 'knee-cap-support', icon: ShieldPlus },
  { name: 'Sublimation/Printing Items', slug: 'sublimation-printing-items', icon: Printer },
  { name: 'Table Tennis', slug: 'table-tennis', icon: CircleDot },
  { name: 'Bikes and Treadmill', slug: 'bikes-treadmill', icon: Bike },
  { name: 'Primary School Items', slug: 'primary-school-items', icon: School },
  { name: 'Indoor Games', slug: 'indoor-games', icon: Gamepad2 },
  { name: 'Gym Equipment and Weight', slug: 'gym-equipment-weight', icon: Dumbbell },
  { name: 'Boxing', slug: 'boxing', icon: ShieldPlus },
  { name: 'Baby Products', slug: 'baby-products', icon: Baby },
  { name: 'Athletic Equipment', slug: 'athletic-equipment', icon: Trophy },
  { name: 'Toys and Games', slug: 'toys-games', icon: Puzzle },
  { name: 'Shuttlecock', slug: 'shuttlecock', icon: Volleyball },
  { name: 'Yonex', slug: 'yonex', icon: Trophy },
  { name: 'Carrom Board', slug: 'carrom-board', icon: Puzzle },
  { name: 'Skipping Ropes', slug: 'skipping-ropes', icon: PersonStanding },
  { name: 'Kits', slug: 'kits', icon: ShoppingBag },
  { name: 'Ladies Sports Wear', slug: 'ladies-sports-wear', icon: Shirt },
]

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Shop All Categories</h1>
        <p className="text-muted-foreground">
          {ALL_CATEGORIES.length} categories of genuine wholesale sports goods
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ALL_CATEGORIES.map(({ name, slug, icon: Icon }) => (
          <Link
            key={slug}
            href={`/shop/${slug}`}
            className="group flex flex-col items-center gap-3 p-6 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all"
          >
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
              <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <span className="text-sm font-medium text-center leading-tight">{name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
