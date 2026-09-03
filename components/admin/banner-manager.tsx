'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ImageIcon, Plus, Trash2, Eye, EyeOff, Upload } from 'lucide-react'

type Banner = {
  id: string
  title: string | null
  image_url: string
  link_url: string | null
  placement: string
  display_order: number
  is_active: boolean
}

export function BannerManager() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [placement, setPlacement] = useState('homepage_hero')
  const [error, setError] = useState<string | null>(null)

  async function loadBanners() {
    setLoading(true)
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })
    setBanners(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadBanners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('site-banners')
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('site-banners').getPublicUrl(filePath)

    const maxOrder = banners.reduce((max, b) => Math.max(max, b.display_order), 0)

    const { error: insertError } = await supabase.from('banners').insert({
      title: title || null,
      image_url: publicUrl,
      link_url: linkUrl || null,
      placement,
      display_order: maxOrder + 1,
    })

    setUploading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setTitle('')
    setLinkUrl('')
    setShowForm(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    await loadBanners()
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('banners').update({ is_active: !current }).eq('id', id)
    await loadBanners()
  }

  async function deleteBanner(id: string) {
    await supabase.from('banners').delete().eq('id', id)
    await loadBanners()
  }

  if (loading) {
    return <LoadingSpinner label="Loading banners..." />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">New Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Link URL (optional)</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/shop/cricket-items"
              />
            </div>
            <div className="space-y-2">
              <Label>Placement</Label>
              <Select value={placement} onValueChange={(v) => setPlacement(v ?? 'homepage_hero')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage_hero">Homepage Hero</SelectItem>
                  <SelectItem value="category_banner">Category Banner</SelectItem>
                  <SelectItem value="promo_strip">Promo Strip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Choose Image and Upload'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Uploading the image saves the banner immediately.
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>
      )}

      {banners.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No banners yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-secondary">
                <Image
                  src={banner.image_url}
                  alt={banner.title || 'Banner'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{banner.title || 'Untitled'}</span>
                    {!banner.is_active && <Badge variant="secondary">Hidden</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {banner.placement.replace('_', ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleActive(banner.id, banner.is_active)}
                  >
                    {banner.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteBanner(banner.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
