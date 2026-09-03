'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DASHBOARD_NAV_ITEMS } from '@/components/dashboard/sidebar'

export function DashboardMobileNav({ shopName }: { shopName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden flex items-center justify-between border rounded-xl px-4 py-3 mb-6">
      <span className="text-sm font-semibold truncate">{shopName}</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline" size="sm" />}>
          <Menu className="h-4 w-4 mr-2" />
          Menu
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px]">
          <SheetHeader>
            <SheetTitle className="text-primary">{shopName}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4 pb-6">
            {DASHBOARD_NAV_ITEMS.map(({ name, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                {name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
