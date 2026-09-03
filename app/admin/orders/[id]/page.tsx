'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ChevronRight, MapPin, Building2 } from 'lucide-react'

const STATUS_OPTIONS = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']

type PageProps = {
  params: Promise<{ id: string }>
}

type OrderDetail = {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: number
  discount_amount: number
  shipping_amount: number
  tax_amount: number
  total_amount: number
  created_at: string
  address_id: string
  business: { shop_name: string; profile: { full_name: string; phone: string } | null } | null
}

type OrderItem = {
  id: string
  product_name: string
  variant_name: string | null
  unit_price: number
  quantity: number
  line_total: number
}

type Address = {
  recipient_name: string
  address_line: string
  city: string
  state: string
  pincode: string
  phone: string
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const supabase = createClient()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  async function loadOrder() {
    setLoading(true)

    const { data: orderData } = await supabase
      .from('orders')
      .select(
        'id, order_number, status, payment_status, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, created_at, address_id, business:businesses(shop_name, profile:profiles(full_name, phone))'
      )
      .eq('id', id)
      .maybeSingle()

    setOrder(orderData as unknown as OrderDetail)

    if (orderData) {
      const [{ data: itemRows }, { data: addressRow }] = await Promise.all([
        supabase
          .from('order_items')
          .select('id, product_name, variant_name, unit_price, quantity, line_total')
          .eq('order_id', id),
        supabase
          .from('addresses')
          .select('recipient_name, address_line, city, state, pincode, phone')
          .eq('id', orderData.address_id)
          .maybeSingle(),
      ])

      setItems(itemRows || [])
      setAddress(addressRow)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function updateStatus(status: string) {
    setUpdating(true)
    await supabase.from('orders').update({ status }).eq('id', id)
    await loadOrder()
    setUpdating(false)
  }

  if (loading) {
    return <LoadingSpinner label="Loading order..." />
  }

  if (!order) {
    return <p className="text-muted-foreground">Order not found.</p>
  }

  return (
    <div>
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/admin/orders" className="hover:text-primary transition-colors">
          Orders
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{order.order_number}</span>
      </nav>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Payment: {order.payment_status}</Badge>
          <Select value={order.status} onValueChange={(v) => v && updateStatus(v)}>
            <SelectTrigger className="w-36" disabled={updating}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {order.business && (
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Business
              </h3>
              <p className="text-sm">{order.business.shop_name}</p>
              <p className="text-sm text-muted-foreground">
                {order.business.profile?.full_name} &middot; {order.business.profile?.phone}
              </p>
            </div>
          )}

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-3">
              {items.map((item) => (
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
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>₹{order.shipping_amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>₹{order.tax_amount.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
