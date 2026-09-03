import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { History } from 'lucide-react'

export const dynamic = 'force-dynamic'

type AuditRow = {
  id: string
  action: string
  table_name: string | null
  record_id: string | null
  created_at: string
  actor_id: string | null
}

const ACTION_VARIANTS: Record<string, string> = {
  INSERT: 'bg-green-600 text-white',
  UPDATE: 'bg-accent text-accent-foreground',
  DELETE: 'bg-destructive text-destructive-foreground',
}

export default async function AdminAuditLogPage() {
  const admin = createAdminClient()

  const { data: logs } = await admin
    .from('audit_logs')
    .select('id, action, table_name, record_id, created_at, actor_id')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = (logs as AuditRow[]) || []

  const actorIds = [...new Set(rows.map((r) => r.actor_id).filter(Boolean))] as string[]
  const { data: profiles } =
    actorIds.length > 0
      ? await admin.from('profiles').select('id, full_name').in('id', actorIds)
      : { data: [] }

  const actorMap = new Map((profiles || []).map((p) => [p.id, p.full_name]))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Audit Log</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Automatic record of changes to products, categories, businesses, orders, and
        coupons. Showing the most recent 200 events.
      </p>

      {rows.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <History className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No activity logged yet. Actions will appear here as products, categories,
            businesses, orders, and coupons are changed.
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">Table</th>
                  <th className="text-left px-4 py-3">By</th>
                  <th className="text-left px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3">
                      <Badge className={ACTION_VARIANTS[log.action] || ''}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium capitalize">
                      {log.table_name?.replace('_', ' ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {log.actor_id ? actorMap.get(log.actor_id) || 'Unknown' : 'System'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
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
