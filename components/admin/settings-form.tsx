'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

type Settings = {
  id: string
  business_phone: string
  business_whatsapp: string
  business_address: string
  business_hours: string
  default_shipping_rate: number
  default_tax_percent: number
}

export function SettingsForm() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
      setSettings(data)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    setSaved(false)

    await supabase
      .from('site_settings')
      .update({
        business_phone: settings.business_phone,
        business_whatsapp: settings.business_whatsapp,
        business_address: settings.business_address,
        business_hours: settings.business_hours,
        default_shipping_rate: settings.default_shipping_rate,
        default_tax_percent: settings.default_tax_percent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return <LoadingSpinner label="Loading settings..." />
  }

  if (!settings) {
    return <p className="text-muted-foreground">Settings not found.</p>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Business Contact Info</CardTitle>
          <CardDescription>
            Shown across the site: footer, contact page, WhatsApp links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={settings.business_phone}
                onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number (digits only, with country code)</Label>
              <Input
                value={settings.business_whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, business_whatsapp: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Business Address</Label>
            <Textarea
              value={settings.business_address}
              onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Business Hours</Label>
            <Input
              value={settings.business_hours}
              onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Shipping and Tax</CardTitle>
          <CardDescription>
            Default rates. Per-order overrides can be added later if needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Shipping Rate (₹)</Label>
              <Input
                type="number"
                value={settings.default_shipping_rate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    default_shipping_rate: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Default Tax Percent (%)</Label>
              <Input
                type="number"
                value={settings.default_tax_percent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    default_tax_percent: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        {saved && <span className="text-sm text-primary">Saved successfully</span>}
      </div>
    </div>
  )
}
