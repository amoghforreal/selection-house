'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, ShoppingCart, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import type { SiteSettings } from '@/lib/site-settings'

const CATEGORIES = [
  'Hockey',
  'Cricket Items',
  'Basketball',
  'Running Shoes',
  'School Bags and Trolley Bags',
  'Skating',
  'Knee Cap and Support',
  'Sublimation/Printing Items',
  'Table Tennis',
  'Bikes and Treadmill',
  'Primary School Items',
  'Indoor Games',
  'Gym Equipment and Weight',
  'Boxing',
  'Baby Products',
  'Athletic Equipment',
  'Toys and Games',
  'Shuttlecock',
  'Yonex',
  'Carrom Board',
  'Skipping Ropes',
  'Kits',
  'Ladies Sports Wear',
]

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Cart count is a placeholder until cart state is wired to Supabase.
const CART_COUNT_PLACEHOLDER = 0

type AuthState = {
  loading: boolean
  isLoggedIn: boolean
  isAdmin: boolean
}

export function Navbar() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [auth, setAuth] = useState<AuthState>({ loading: true, isLoggedIn: false, isAdmin: false })
  const [settings, setSettings] = useState<Pick<SiteSettings, 'business_address'> | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadAuth(userId: string | null) {
      if (!userId) {
        setAuth({ loading: false, isLoggedIn: false, isAdmin: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      setAuth({
        loading: false,
        isLoggedIn: true,
        isAdmin: !!profile && ['staff', 'admin', 'super_admin'].includes(profile.role),
      })
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      loadAuth(user?.id ?? null)
    })

    supabase
      .from('site_settings')
      .select('business_address')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setSettings(data))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadAuth(session?.user?.id ?? null)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setMobileOpen(false)
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }

  const accountHref = auth.isAdmin ? '/admin' : '/dashboard'
  const accountLabel = auth.isAdmin ? 'Admin Panel' : 'My Dashboard'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top strip: contact info, desktop only */}
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-between">
          <span>Wholesale sports goods supplier, serving shop owners since 1989</span>
          <span>{settings?.business_address?.split(',').slice(-2).join(',').trim() || 'Pilibhit, Uttar Pradesh'}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-primary">Selection House</span>
          </Link>

          {/* Desktop search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <Input
              type="search"
              placeholder="Search for products..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Search">
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {auth.loading ? (
              <div className="h-9 w-24 rounded-md bg-secondary animate-pulse" />
            ) : auth.isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  {auth.isAdmin ? (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  ) : (
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                  )}
                  {accountLabel}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link href={accountHref} />}>
                    {accountLabel}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  render={<Link href="/login" aria-label="Account" />}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button render={<Link href="/register" />}>Register Business</Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              render={<Link href="/dashboard/cart" aria-label="Cart" />}
            >
              <ShoppingCart className="h-5 w-5" />
              {CART_COUNT_PLACEHOLDER > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {CART_COUNT_PLACEHOLDER}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              render={<Link href="/dashboard/cart" aria-label="Cart" />}
            >
              <ShoppingCart className="h-5 w-5" />
              {CART_COUNT_PLACEHOLDER > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {CART_COUNT_PLACEHOLDER}
                </Badge>
              )}
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" aria-label="Menu" />}
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-primary">Selection House</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6 flex flex-col gap-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="pr-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Search">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </form>

                  {auth.loading ? (
                    <div className="h-9 w-full rounded-md bg-secondary animate-pulse" />
                  ) : auth.isLoggedIn ? (
                    <>
                      <Button render={<Link href={accountHref} />} onClick={() => setMobileOpen(false)}>
                        {auth.isAdmin ? (
                          <ShieldCheck className="h-4 w-4 mr-2" />
                        ) : (
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                        )}
                        {accountLabel}
                      </Button>
                      <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button render={<Link href="/login" />} onClick={() => setMobileOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Login / My Account
                      </Button>
                      <Button
                        variant="outline"
                        render={<Link href="/register" />}
                        onClick={() => setMobileOpen(false)}
                      >
                        Register Your Business
                      </Button>
                    </>
                  )}

                  <Separator />

                  <p className="text-sm font-semibold text-muted-foreground">Categories</p>
                  <nav className="flex flex-col gap-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        href={`/shop/${slugify(cat)}`}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 text-sm hover:text-primary transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop categories bar */}
        <div className="hidden md:flex items-center gap-6 h-11 border-t text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="font-semibold" />}>
              <Menu className="h-4 w-4 mr-1" />
              All Categories
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-96 overflow-y-auto">
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat} render={<Link href={`/shop/${slugify(cat)}`} />}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop All
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/wholesale-terms" className="hover:text-primary transition-colors">
            Wholesale Terms
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </header>
  )
}
