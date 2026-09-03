import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

type PaymentRow = {
  id: string
  razorpay_payment_id: string | null
  amount: number
  status: string
  method: string | null
  created_at: string
  order: { order_number: string; business: { shop_name: string } | null } | null
}

const STATUS_VARIANTS: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  paid: 'bg-green-600 text-white',
  failed: 'bg-destructive text-destructive-foreground',
  refunded: 'bg-accent text-accent-foreground',
}

export default async function AdminPaymentsPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select(
      'id, razorpay_payment_id, amount, status, method, created_at, order:orders(order_number, business:businesses(shop_name))'
    )
    .order('created_at', { ascending: false })

  const rows = (payments as unknown as PaymentRow[]) || []

  const totalPaid = rows
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground text-sm">
            Total collected: <span className="font-semibold text-primary">₹{totalPaid.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No payments recorded yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">Business</th>
                  <th className="text-left px-4 py-3">Method</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 font-medium">
                      {payment.order?.order_number || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {payment.order?.business?.shop_name || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {payment.method || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_VARIANTS[payment.status] || ''}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(payment.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
