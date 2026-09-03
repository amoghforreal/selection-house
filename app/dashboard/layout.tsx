import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('status, shop_name')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (!business) {
    redirect('/register')
  }

  if (business.status === 'pending') {
    redirect('/pending-approval')
  }

  if (business.status === 'rejected' || business.status === 'blocked') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <AlertTriangle className="h-10 w-10 mx-auto text-destructive mb-4" />
        <h1 className="text-xl font-bold mb-2">Account Access Restricted</h1>
        <p className="text-muted-foreground text-sm">
          Your business account is currently not active. Please contact us on WhatsApp
          at +91 63986 58181 for assistance.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
              {business.shop_name}
            </p>
            <DashboardSidebar />
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
