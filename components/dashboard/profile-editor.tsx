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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

type ProfileData = {
  full_name: string
  phone: string
}

type BusinessData = {
  shop_name: string
  gst_number: string | null
  business_address: string
  city: string
  state: string
  pincode: string
  status: string
  tier: string
}

export function ProfileEditor() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState<ProfileData>({ full_name: '', phone: '' })
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setEmail(user.email || '')

      const { data: profileRow } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .maybeSingle()

      if (profileRow) setProfile(profileRow)

      const { data: businessRow } = await supabase
        .from('businesses')
        .select('shop_name, gst_number, business_address, city, state, pincode, status, tier')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (businessRow) setBusiness(businessRow)

      setLoading(false)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from('profiles')
      .update({ full_name: profile.full_name, phone: profile.phone })
      .eq('id', user.id)

    if (business) {
      await supabase
        .from('businesses')
        .update({
          shop_name: business.shop_name,
          business_address: business.business_address,
          city: business.city,
          state: business.state,
          pincode: business.pincode,
        })
        .eq('profile_id', user.id)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return <LoadingSpinner label="Loading profile..." />
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {business && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Business Details
              <Badge variant="secondary" className="capitalize">
                {business.tier}
              </Badge>
            </CardTitle>
            <CardDescription>
              GST Number: {business.gst_number || 'Not provided'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Shop Name</Label>
              <Input
                value={business.shop_name}
                onChange={(e) => setBusiness({ ...business, shop_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Business Address</Label>
              <Input
                value={business.business_address}
                onChange={(e) =>
                  setBusiness({ ...business, business_address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={business.city}
                  onChange={(e) => setBusiness({ ...business, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={business.state}
                  onChange={(e) => setBusiness({ ...business, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={business.pincode}
                  onChange={(e) => setBusiness({ ...business, pincode: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        {saved && <span className="text-sm text-primary">Saved successfully</span>}
      </div>
    </div>
  )
}
