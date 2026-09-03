import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  FileText,
  Heart,
  User,
  MapPin,
  MessageSquare,
} from 'lucide-react'

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Browse Catalogue', href: '/dashboard/catalogue', icon: ShoppingBag },
  { name: 'Cart', href: '/dashboard/cart', icon: ShoppingCart },
  { name: 'Order History', href: '/dashboard/orders', icon: ClipboardList },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { name: 'Support', href: '/dashboard/support', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function DashboardSidebar() {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Icon className="h-4 w-4" />
          {name}
        </Link>
      ))}
    </nav>
  )
}
