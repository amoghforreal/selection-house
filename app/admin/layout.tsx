import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !['staff', 'admin', 'super_admin'].includes(profile.role)) {
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <div className="flex items-center gap-2 px-3 mb-4">
              <Image
                src="/brand/logo-sports-readymade-transparent.png"
                alt="Selection House"
                width={120}
                height={34}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
              Admin Panel · {profile.full_name}
            </p>
            <AdminSidebar />
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
