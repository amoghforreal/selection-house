import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_VARIANTS: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-accent text-accent-foreground',
  packed: 'bg-secondary text-secondary-foreground',
  shipped: 'bg-primary text-primary-foreground',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-destructive text-destructive-foreground',
}

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('profile_id', user!.id)
    .maybeSingle()

  let orders: Array<{
    id: string
    order_number: string
    status: string
    payment_status: string
    total_amount: number
    created_at: string
  }> = []

  if (business) {
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, status, payment_status, total_amount, created_at')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })

    orders = data || []
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="flex items-center justify-between border rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all"
            >
              <div>
                <p className="font-medium text-sm">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={STATUS_VARIANTS[order.status] || ''}>
                  {order.status}
                </Badge>
                <span className="font-semibold text-sm">
                  ₹{order.total_amount.toFixed(2)}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
