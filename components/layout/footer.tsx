import Link from 'next/link'
import { MapPin, Phone, Instagram, MessageCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const CATEGORIES = [
  'Hockey',
  'Cricket Items',
  'Basketball',
  'Running Shoes',
  'Yonex',
  'Carrom Board',
  'Gym Equipment and Weight',
  'School Bags and Trolley Bags',
]

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-\$)/g, '')
}

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-2">Selection House</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Trusted wholesale sports goods supplier for shop owners, serving since 1989.
          </p>
          <div className="flex items-start gap-2 text-sm mb-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
            <span>Station Road, Pilibhit, Opp. BOB Bank, Pilibhit, Uttar Pradesh</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 shrink-0 text-accent" />
            <a href="tel:+916398658181" className="hover:text-primary transition-colors">
              +91 63986 58181
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/shop" className="hover:text-primary transition-colors">Shop All Products</Link></li>
            <li><Link href="/wholesale-terms" className="hover:text-primary transition-colors">Wholesale Terms</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/register" className="hover:text-primary transition-colors">Register Your Business</Link></li>
          </ul>
        </div>

        {/* Popular Categories */}
        <div>
          <h4 className="font-semibold mb-3">Popular Categories</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link href={\/shop/\\} className="hover:text-primary transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="font-semibold mb-3">Connect With Us</h4>
          <div className="flex flex-col gap-2 text-sm">
            
              href="https://wa.me/916398658181"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-accent" />
              WhatsApp Us
            </a>
            
              href="https://instagram.com/selectionhouse.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4 text-accent" />
              @selectionhouse.in
            </a>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Wholesale Support Hours</p>
            <p>Mon to Sat: 10:00 AM to 8:00 PM</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Selection House. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-primary transition-colors">Terms and Conditions</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}
