import { createClient } from '@/lib/supabase/server'

export type SiteSettings = {
  id: string
  business_phone: string
  business_whatsapp: string
  business_address: string
  business_hours: string
  default_shipping_rate: number
  default_tax_percent: number
}

// Server-side only. Reads are public per RLS, so this is safe to call
// from any server component without auth.
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
  return data
}
