import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileText, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('profile_id', user!.id)
    .maybeSingle()

  let invoices: Array<{
    id: string
    order_number: string
    total_amount: number
    created_at: string
  }> = []

  if (business) {
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, total_amount, created_at')
      .eq('business_id', business.id)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })

    invoices = data || []
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      {invoices.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Invoices appear here once you have a paid order.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/dashboard/orders/${invoice.id}`}
              className="flex items-center justify-between border rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{invoice.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(invoice.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">
                  ₹{invoice.total_amount.toFixed(2)}
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
