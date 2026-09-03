'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Search, ShoppingCart, User } from 'lucide-react'
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
    .replace(/(^-|-\$)/g, '')
}

// Cart count is a placeholder until cart state is wired to Supabase.
const CART_COUNT_PLACEHOLDER = 0

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top strip: contact info, desktop only */}
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-between">
          <span>Wholesale sports goods supplier, serving shop owners since 1989</span>
          <span>Pilibhit, Uttar Pradesh</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-primary">Selection House</span>
          </Link>

          {/* Desktop search bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Input
              type="search"
              placeholder="Search for products..."
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/login" aria-label="Account" />}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              render={<Link href="/cart" aria-label="Cart" />}
            >
              <ShoppingCart className="h-5 w-5" />
              {CART_COUNT_PLACEHOLDER > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {CART_COUNT_PLACEHOLDER}
                </Badge>
              )}
            </Button>
            <Button render={<Link href="/register" />}>Register Business</Button>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              render={<Link href="/cart" aria-label="Cart" />}
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
                  <div className="relative">
                    <Input type="search" placeholder="Search for products..." className="pr-10" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>

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

                  <Separator />

                  <p className="text-sm font-semibold text-muted-foreground">Categories</p>
                  <nav className="flex flex-col gap-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        href={\/shop/\\}
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
                <DropdownMenuItem key={cat} render={<Link href={\/shop/\\} />}>
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
