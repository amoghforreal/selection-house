import Link from 'next/link'
import Image from 'next/image'
import { placeholderImage } from '@/lib/placeholder-image'
import { ArrowRight, ShieldCheck, Truck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Trusted Since 1989
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            Wholesale Sports Goods for Shop Owners Who Demand Quality
          </h1>
          <p className="text-primary-foreground/80 text-base md:text-lg mb-8 max-w-xl">
            From cricket to gym equipment, Yonex to school bags, Selection House supplies
            retailers and distributors across the region with genuine products at real
            wholesale prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="text-base"
              render={<Link href="/register" />}
            >
              Register Your Business
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              render={<Link href="/shop" />}
            >
              Browse Catalogue
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <span className="text-xs sm:text-sm text-primary-foreground/80">
                Genuine Products
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="h-6 w-6 text-accent" />
              <span className="text-xs sm:text-sm text-primary-foreground/80">
                Bulk Delivery
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Users className="h-6 w-6 text-accent" />
              <span className="text-xs sm:text-sm text-primary-foreground/80">
                350+ Retailers Served
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder photo, swap for real store/product photography once available */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden border border-primary-foreground/20">
            <Image
              src={placeholderImage('sports store', 700, 700)}
              alt="Selection House wholesale sports goods"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
