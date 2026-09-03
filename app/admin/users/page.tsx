import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const admin = createAdminClient()

  const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const authUsers = authData?.users || []

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, phone, role, created_at')

  const { data: businesses } = await admin
    .from('businesses')
    .select('profile_id, shop_name, status')

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]))
  const businessMap = new Map((businesses || []).map((b) => [b.profile_id, b]))

  const rows = authUsers
    .map((u) => {
      const profile = profileMap.get(u.id)
      const business = businessMap.get(u.id)
      return {
        id: u.id,
        email: u.email || 'No email',
        fullName: profile?.full_name || 'Unknown',
        phone: profile?.phone || '',
        role: profile?.role || 'buyer',
        shopName: business?.shop_name || null,
        businessStatus: business?.status || null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at,
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const ROLE_VARIANTS: Record<string, string> = {
    buyer: 'bg-secondary text-secondary-foreground',
    staff: 'bg-accent text-accent-foreground',
    admin: 'bg-primary text-primary-foreground',
    super_admin: 'bg-primary text-primary-foreground',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">All Users</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Every account that has signed up, {rows.length} total.
      </p>

      {rows.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Shop</th>
                  <th className="text-left px-4 py-3">Registered</th>
                  <th className="text-left px-4 py-3">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-medium">{row.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={ROLE_VARIANTS[row.role] || ''}>
                        {row.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.shopName || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {row.lastSignInAt
                        ? new Date(row.lastSignInAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Never logged in'}
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
