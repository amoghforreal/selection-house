'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserCog, Search } from 'lucide-react'

type StaffUser = {
  id: string
  email: string
  fullName: string
  role: string
}

const ROLE_VARIANTS: Record<string, string> = {
  buyer: 'bg-secondary text-secondary-foreground',
  staff: 'bg-accent text-accent-foreground',
  admin: 'bg-primary text-primary-foreground',
  super_admin: 'bg-primary text-primary-foreground',
}

export function StaffRoleManager({ initialUsers }: { initialUsers: StaffUser[] }) {
  const supabase = createClient()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
  )

  const staffAndAbove = filtered.filter((u) => u.role !== 'buyer')

  async function updateRole(userId: string, newRole: string) {
    setUpdatingId(userId)
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    setUpdatingId(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Staff and Roles</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Search any registered user and grant staff or admin access.
      </p>

      <div className="relative mb-6 max-w-md">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {search && (
        <div className="mb-8">
          <p className="text-sm font-semibold mb-2">Search Results</p>
          <div className="space-y-2">
            {filtered.slice(0, 10).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border rounded-xl p-3"
              >
                <div>
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Select
                  value={user.role}
                  onValueChange={(v) => v && updateRole(user.id, v)}
                >
                  <SelectTrigger className="w-36" disabled={updatingId === user.id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm font-semibold mb-2">Current Staff and Admins</p>
      {staffAndAbove.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <UserCog className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No staff or admin accounts yet besides you.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {staffAndAbove.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border rounded-xl p-3"
            >
              <div>
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge className={ROLE_VARIANTS[user.role] || ''}>
                {user.role.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
