import type { Metadata } from 'next'
import { BadgeCheck, Handshake, PackageCheck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Selection House, a trusted wholesale sports goods supplier based in Pilibhit, serving shop owners since 1989.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="text-center mb-12">
        <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Since 1989
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Selection House</h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          For over three decades, Selection House has been a trusted name in wholesale
          sports goods, serving retailers and distributors across the region from our
          base in Pilibhit, Uttar Pradesh.
        </p>
      </div>

      <div className="prose prose-sm md:prose-base max-w-none mb-14">
        <p className="text-muted-foreground leading-relaxed mb-4">
          What started as a single sports goods shop on Station Road, Pilibhit in 1989
          has grown into a full wholesale supply business, helping shop owners across
          the region stock genuine, quality sports equipment at real wholesale prices.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Today, Selection House supplies a wide range of products, from cricket and
          hockey equipment to gym gear, school bags, Yonex badminton products, and more,
          serving hundreds of retailers who trust us to keep their shelves stocked with
          products their customers actually want.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        <div className="border rounded-xl p-6 flex flex-col items-start gap-3">
          <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center">
            <BadgeCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-semibold">Genuine Products Only</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every product we supply is sourced directly and verified for authenticity,
            no compromises on quality.
          </p>
        </div>
        <div className="border rounded-xl p-6 flex flex-col items-start gap-3">
          <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center">
            <Handshake className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-semibold">Fair Wholesale Pricing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Transparent, tiered bulk pricing designed to help shop owners maintain
            healthy margins.
          </p>
        </div>
        <div className="border rounded-xl p-6 flex flex-col items-start gap-3">
          <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center">
            <PackageCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-semibold">Reliable Supply</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Consistent stock availability across our full product range, so your shop
            is never left waiting.
          </p>
        </div>
        <div className="border rounded-xl p-6 flex flex-col items-start gap-3">
          <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-semibold">350+ Retailers Served</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A growing network of shop owners across the region who rely on Selection
            House for their inventory.
          </p>
        </div>
      </div>

      <div className="border rounded-xl p-6 md:p-8 bg-secondary/50 text-center">
        <h2 className="text-xl font-bold mb-2">Visit Us</h2>
        <p className="text-muted-foreground text-sm">
          Station Road, Pilibhit, Opp. BOB Bank, Pilibhit, Uttar Pradesh
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Mon to Sat: 10:00 AM to 8:00 PM
        </p>
      </div>
    </div>
  )
}
