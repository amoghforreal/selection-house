'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Tag, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

type Coupon = {
  id: string
  code: string
  description: string | null
  discount_percent: number | null
  discount_flat: number | null
  min_order_amount: number | null
  max_uses: number | null
  used_count: number
  is_active: boolean
}

export function CouponManager() {
  const supabase = createClient()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountPercent: '',
    minOrderAmount: '',
    maxUses: '',
  })

  async function loadCoupons() {
    setLoading(true)
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    setCoupons(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadCoupons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addCoupon() {
    if (!form.code.trim() || !form.discountPercent) return
    setSaving(true)

    await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      description: form.description || null,
      discount_percent: parseFloat(form.discountPercent),
      min_order_amount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : 0,
      max_uses: form.maxUses ? parseInt(form.maxUses) : null,
    })

    setForm({ code: '', description: '', discountPercent: '', minOrderAmount: '', maxUses: '' })
    setShowForm(false)
    setSaving(false)
    await loadCoupons()
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('coupons').update({ is_active: !current }).eq('id', id)
    await loadCoupons()
  }

  async function deleteCoupon(id: string) {
    await supabase.from('coupons').delete().eq('id', id)
    await loadCoupons()
  }

  if (loading) {
    return <LoadingSpinner label="Loading coupons..." />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">New Coupon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="WELCOME10"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Percent</Label>
                <Input
                  type="number"
                  value={form.discountPercent}
                  onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="First order discount for new buyers"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Order Amount (₹)</Label>
                <Input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Uses (optional)</Label>
                <Input
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  placeholder="Unlimited if blank"
                />
              </div>
            </div>
            <Button onClick={addCoupon} disabled={saving}>
              {saving ? 'Saving...' : 'Save Coupon'}
            </Button>
          </CardContent>
        </Card>
      )}

      {coupons.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Tag className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No coupons yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between border rounded-xl p-4 flex-wrap gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm">{coupon.code}</span>
                  {!coupon.is_active && <Badge variant="secondary">Inactive</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {coupon.discount_percent}% off
                  {coupon.min_order_amount ? ` · min ₹${coupon.min_order_amount}` : ''}
                  {coupon.max_uses ? ` · used ${coupon.used_count}/${coupon.max_uses}` : ` · used ${coupon.used_count}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleActive(coupon.id, coupon.is_active)}
                >
                  {coupon.is_active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteCoupon(coupon.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
