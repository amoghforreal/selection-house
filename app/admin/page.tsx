import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, ClipboardList, IndianRupee, PackageX, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [
    { count: pendingBusinesses },
    { count: totalOrders },
    { count: pendingOrders },
    { data: paidOrders },
    { data: lowStockVariants },
  ] = await Promise.all([
    supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'confirmed', 'packed']),
    supabase.from('orders').select('total_amount').eq('payment_status', 'paid'),
    supabase
      .from('product_variants')
      .select('id, variant_name, stock_quantity, product:products(name)')
      .lt('stock_quantity', 10)
      .eq('is_active', true)
      .limit(5),
  ])

  const totalRevenue = (paidOrders || []).reduce(
    (sum, order) => sum + Number(order.total_amount),
    0
  )

  type LowStockRow = {
    id: string
    variant_name: string
    stock_quantity: number
    product: { name: string } | null
  }
  const lowStock = (lowStockVariants as unknown as LowStockRow[]) || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Admin Overview</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Quick snapshot of store activity.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-accent">{pendingBusinesses || 0}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Orders In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-primary">{pendingOrders || 0}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{totalOrders || 0}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-primary">
              ₹{totalRevenue.toFixed(0)}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending Business Approvals</CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/admin/businesses" />}>
              View All
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {(pendingBusinesses || 0) === 0 ? (
              <p className="text-sm text-muted-foreground">No pending approvals right now.</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {pendingBusinesses} business{pendingBusinesses === 1 ? '' : 'es'} waiting
                for review.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-1.5">
              <PackageX className="h-4 w-4" />
              Low Stock Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/admin/products" />}>
              View All
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">No low stock items.</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between text-sm">
                    <span>
                      {variant.product?.name} ({variant.variant_name})
                    </span>
                    <span className="text-destructive font-medium">
                      {variant.stock_quantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
