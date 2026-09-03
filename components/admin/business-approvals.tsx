'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Check, X, Ban, Users } from 'lucide-react'

type Business = {
  id: string
  shop_name: string
  gst_number: string | null
  business_address: string
  city: string
  state: string
  pincode: string
  status: string
  tier: string
  created_at: string
  profile: { full_name: string; phone: string } | null
}

const STATUS_VARIANTS: Record<string, string> = {
  pending: 'bg-accent text-accent-foreground',
  approved: 'bg-green-600 text-white',
  rejected: 'bg-destructive text-destructive-foreground',
  blocked: 'bg-muted text-muted-foreground',
}

export function BusinessApprovals() {
  const supabase = createClient()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('pending')
  const [actingId, setActingId] = useState<string | null>(null)

  async function loadBusinesses() {
    setLoading(true)
    let query = supabase
      .from('businesses')
      .select(
        'id, shop_name, gst_number, business_address, city, state, pincode, status, tier, created_at, profile:profiles(full_name, phone)'
      )
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setBusinesses((data as unknown as Business[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadBusinesses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function updateStatus(id: string, status: string) {
    setActingId(id)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase
      .from('businesses')
      .update({
        status,
        approved_by: status === 'approved' ? user?.id : null,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', id)

    await loadBusinesses()
    setActingId(null)
  }

  if (loading) {
    return <LoadingSpinner label="Loading businesses..." />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Business Approvals</h1>
        <Select value={filter} onValueChange={(value) => setFilter(value ?? "pending")}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {businesses.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No businesses found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {businesses.map((biz) => (
            <Card key={biz.id}>
              <CardHeader className="flex flex-row items-start justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {biz.shop_name}
                    <Badge className={STATUS_VARIANTS[biz.status] || ''}>{biz.status}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {biz.profile?.full_name} &middot; {biz.profile?.phone}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">
                  {biz.business_address}, {biz.city}, {biz.state} {biz.pincode}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  GST: {biz.gst_number || 'Not provided'}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  {biz.status !== 'approved' && (
                    <Button
                      size="sm"
                      disabled={actingId === biz.id}
                      onClick={() => updateStatus(biz.id, 'approved')}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </Button>
                  )}
                  {biz.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actingId === biz.id}
                      onClick={() => updateStatus(biz.id, 'rejected')}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                  )}
                  {biz.status !== 'blocked' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actingId === biz.id}
                      onClick={() => updateStatus(biz.id, 'blocked')}
                      className="text-destructive hover:text-destructive"
                    >
                      <Ban className="h-3.5 w-3.5 mr-1" />
                      Block
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
