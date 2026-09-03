import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  Users,
  CreditCard,
  Tag,
  Image as ImageIcon,
  Star,
  UserCog,
  History,
  Settings,
} from 'lucide-react'

export const ADMIN_NAV_ITEMS = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Businesses', href: '/admin/businesses', icon: Users },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Staff & Roles', href: '/admin/staff', icon: UserCog },
  { name: 'Audit Log', href: '/admin/audit-log', icon: History },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  return (
    <nav className="flex flex-col gap-1">
      {ADMIN_NAV_ITEMS.map(({ name, href, icon: Icon }) => (
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
