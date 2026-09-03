import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, MapPin, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_VARIANTS: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-accent text-accent-foreground',
  packed: 'bg-secondary text-secondary-foreground',
  shipped: 'bg-primary text-primary-foreground',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-destructive text-destructive-foreground',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(
      'id, order_number, status, payment_status, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, created_at, address_id'
    )
    .eq('id', id)
    .maybeSingle()

  if (!order) {
    notFound()
  }

  const [{ data: items }, { data: address }] = await Promise.all([
    supabase
      .from('order_items')
      .select('id, product_name, variant_name, unit_price, quantity, line_total')
      .eq('order_id', order.id),
    supabase
      .from('addresses')
      .select('label, recipient_name, address_line, city, state, pincode, phone')
      .eq('id', order.address_id)
      .maybeSingle(),
  ])

  return (
    <div>
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/dashboard/orders" className="hover:text-primary transition-colors">
          Order History
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{order.order_number}</span>
      </nav>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={STATUS_VARIANTS[order.status] || ''}>{order.status}</Badge>
          <Badge variant="outline">Payment: {order.payment_status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-3">
              {(items || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ₹{item.unit_price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-medium">₹{item.line_total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {address && (
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </h3>
              <p className="text-sm">{address.recipient_name}</p>
              <p className="text-sm text-muted-foreground">
                {address.address_line}, {address.city}, {address.state} {address.pincode}
              </p>
              <p className="text-sm text-muted-foreground">{address.phone}</p>
            </div>
          )}
        </div>

        <div className="border rounded-xl p-5 h-fit">
          <h3 className="font-semibold mb-4">Payment Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>-₹{order.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>₹{order.shipping_amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>₹{order.tax_amount.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between font-bold text-lg border-t pt-3 mb-5">
            <span>Total</span>
            <span>₹{order.total_amount.toFixed(2)}</span>
          </div>

          {order.payment_status === 'paid' && (
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
