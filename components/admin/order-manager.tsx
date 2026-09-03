'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
import { ClipboardList, ChevronRight } from 'lucide-react'

type OrderRow = {
  id: string
  order_number: string
  status: string
  payment_status: string
  total_amount: number
  created_at: string
  business: { shop_name: string } | null
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']

const STATUS_VARIANTS: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-accent text-accent-foreground',
  packed: 'bg-secondary text-secondary-foreground',
  shipped: 'bg-primary text-primary-foreground',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-destructive text-destructive-foreground',
}

export function OrderManager() {
  const supabase = createClient()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadOrders() {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select(
        'id, order_number, status, payment_status, total_amount, created_at, business:businesses(shop_name)'
      )
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setOrders((data as unknown as OrderRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function updateOrderStatus(orderId: string, status: string) {
    setUpdatingId(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    await loadOrders()
    setUpdatingId(null)
  }

  if (loading) {
    return <LoadingSpinner label="Loading orders..." />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Select value={filter} onValueChange={(value) => setFilter(value ?? 'all')}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No orders found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border rounded-xl p-4 flex-wrap gap-3"
            >
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="hover:text-primary transition-colors"
                >
                  <p className="font-medium text-sm">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.business?.shop_name || 'Unknown business'} &middot;{' '}
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline">{order.payment_status}</Badge>
                <span className="font-semibold text-sm">₹{order.total_amount.toFixed(2)}</span>
                <Select
                  value={order.status}
                  onValueChange={(value) => value && updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger
                    className={`w-32 h-8 text-xs ${STATUS_VARIANTS[order.status] || ''}`}
                    disabled={updatingId === order.id}
                  >
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
                <Link href={`/admin/orders/${order.id}`}>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
