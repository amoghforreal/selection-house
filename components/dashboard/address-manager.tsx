'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { MapPin, Plus, Trash2 } from 'lucide-react'

type Address = {
  id: string
  label: string
  recipient_name: string
  phone: string
  address_line: string
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    address_line: '',
    city: '',
    state: '',
    pincode: '',
  })

  const supabase = createClient()

  async function loadAddresses() {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (!business) {
      setLoading(false)
      return
    }

    setBusinessId(business.id)

    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('business_id', business.id)
      .order('is_default', { ascending: false })

    setAddresses(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addAddress() {
    if (!businessId) return
    setSaving(true)

    await supabase.from('addresses').insert({
      business_id: businessId,
      label: form.label || 'New Address',
      recipient_name: form.recipient_name,
      phone: form.phone,
      address_line: form.address_line,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      is_default: addresses.length === 0,
    })

    setForm({
      label: '',
      recipient_name: '',
      phone: '',
      address_line: '',
      city: '',
      state: '',
      pincode: '',
    })
    setShowForm(false)
    setSaving(false)
    await loadAddresses()
  }

  async function deleteAddress(id: string) {
    await supabase.from('addresses').delete().eq('id', id)
    await loadAddresses()
  }

  async function makeDefault(id: string) {
    if (!businessId) return
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('business_id', businessId)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    await loadAddresses()
  }

  if (loading) {
    return <LoadingSpinner label="Loading addresses..." />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Addresses</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">New Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Address Label</Label>
                <Input
                  placeholder="Main Branch, Warehouse..."
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Recipient Name</Label>
                <Input
                  value={form.recipient_name}
                  onChange={(e) => setForm({ ...form, recipient_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address Line</Label>
              <Input
                value={form.address_line}
                onChange={(e) => setForm({ ...form, address_line: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={addAddress} disabled={saving}>
              {saving ? 'Saving...' : 'Save Address'}
            </Button>
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{addr.label}</span>
                    {addr.is_default && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteAddress(addr.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm">{addr.recipient_name}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.address_line}, {addr.city}, {addr.state} {addr.pincode}
                </p>
                <p className="text-sm text-muted-foreground">{addr.phone}</p>
                {!addr.is_default && (
                  <div className="flex items-center gap-2 mt-3">
                    <Checkbox
                      id={`default-${addr.id}`}
                      onCheckedChange={() => makeDefault(addr.id)}
                    />
                    <Label htmlFor={`default-${addr.id}`} className="text-xs font-normal">
                      Set as default
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
