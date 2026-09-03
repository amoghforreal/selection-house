import { createAdminClient } from '@/lib/supabase/admin'
import { StaffRoleManager } from '@/components/admin/staff-role-manager'

export const dynamic = 'force-dynamic'

export default async function AdminStaffPage() {
  const admin = createAdminClient()

  const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const authUsers = authData?.users || []

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, role')

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]))

  const users = authUsers
    .map((u) => {
      const profile = profileMap.get(u.id)
      return {
        id: u.id,
        email: u.email || 'No email',
        fullName: profile?.full_name || 'Unknown',
        role: profile?.role || 'buyer',
      }
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName))

  return <StaffRoleManager initialUsers={users} />
}
