import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, ClipboardList, MapPin, MessageSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .maybeSingle()

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('profile_id', user!.id)
    .maybeSingle()

  let orderCount = 0
  let pendingOrderCount = 0

  if (business) {
    const { count: total } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id)

    const { count: pending } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .in('status', ['pending', 'confirmed', 'packed'])

    orderCount = total || 0
    pendingOrderCount = pending || 0
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Here&apos;s a quick look at your account.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{orderCount}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Orders In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-accent">{pendingOrderCount}</span>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-5"
          render={<Link href="/dashboard/catalogue" />}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs">Browse Catalogue</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-5"
          render={<Link href="/dashboard/orders" />}
        >
          <ClipboardList className="h-5 w-5" />
          <span className="text-xs">My Orders</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-5"
          render={<Link href="/dashboard/addresses" />}
        >
          <MapPin className="h-5 w-5" />
          <span className="text-xs">Addresses</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-5"
          render={<Link href="/dashboard/support" />}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Get Support</span>
        </Button>
      </div>
    </div>
  )
}
