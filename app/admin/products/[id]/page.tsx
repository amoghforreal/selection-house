'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Trash2, Plus } from 'lucide-react'
import { ProductPhotoUpload } from '@/components/admin/product-photo-upload'

type PageProps = {
  params: Promise<{ id: string }>
}

type Variant = { id: string; variant_name: string; stock_quantity: number; is_active: boolean }
type PricingTier = { id: string; min_quantity: number; discount_percent: number }

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    brand: '',
    basePrice: '',
    moq: '1',
    sku: '',
    isFeatured: false,
    isActive: true,
  })
  const [slug, setSlug] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const [variants, setVariants] = useState<Variant[]>([])
  const [newVariantName, setNewVariantName] = useState('')
  const [newVariantStock, setNewVariantStock] = useState('')

  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [newTierQty, setNewTierQty] = useState('')
  const [newTierDiscount, setNewTierDiscount] = useState('')

  async function loadAll() {
    setLoading(true)

    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        brand: product.brand || '',
        basePrice: String(product.base_price),
        moq: String(product.moq),
        sku: product.sku || '',
        isFeatured: product.is_featured,
        isActive: product.is_active,
      })
      setSlug(product.slug)
      setCoverImageUrl(product.cover_image_url)
    }

    const { data: variantRows } = await supabase
      .from('product_variants')
      .select('id, variant_name, stock_quantity, is_active')
      .eq('product_id', id)

    setVariants(variantRows || [])

    const { data: tierRows } = await supabase
      .from('pricing_tiers')
      .select('id, min_quantity, discount_percent')
      .eq('product_id', id)
      .order('min_quantity', { ascending: true })

    setTiers(tierRows || [])

    setLoading(false)
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function saveProduct() {
    setSaving(true)
    await supabase
      .from('products')
      .update({
        name: form.name,
        description: form.description || null,
        brand: form.brand || null,
        base_price: parseFloat(form.basePrice),
        moq: parseInt(form.moq) || 1,
        sku: form.sku || null,
        is_featured: form.isFeatured,
        is_active: form.isActive,
      })
      .eq('id', id)
    setSaving(false)
  }

  async function deleteProduct() {
    await supabase.from('products').delete().eq('id', id)
    router.push('/admin/products')
  }

  async function addVariant() {
    if (!newVariantName.trim()) return
    await supabase.from('product_variants').insert({
      product_id: id,
      variant_name: newVariantName,
      stock_quantity: parseInt(newVariantStock) || 0,
    })
    setNewVariantName('')
    setNewVariantStock('')
    await loadAll()
  }

  async function updateVariantStock(variantId: string, stock: number) {
    await supabase
      .from('product_variants')
      .update({ stock_quantity: stock })
      .eq('id', variantId)
    await loadAll()
  }

  async function deleteVariant(variantId: string) {
    await supabase.from('product_variants').delete().eq('id', variantId)
    await loadAll()
  }

  async function addTier() {
    if (!newTierQty || !newTierDiscount) return
    await supabase.from('pricing_tiers').insert({
      product_id: id,
      min_quantity: parseInt(newTierQty),
      discount_percent: parseFloat(newTierDiscount),
    })
    setNewTierQty('')
    setNewTierDiscount('')
    await loadAll()
  }

  async function deleteTier(tierId: string) {
    await supabase.from('pricing_tiers').delete().eq('id', tierId)
    await loadAll()
  }

  if (loading) {
    return <LoadingSpinner label="Loading product..." />
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Button
          variant="outline"
          onClick={deleteProduct}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductPhotoUpload
            productId={id}
            productSlug={slug}
            currentImageUrl={coverImageUrl}
            onUploaded={setCoverImageUrl}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Base Price (₹)</Label>
              <Input
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>MOQ</Label>
              <Input value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.isFeatured}
                onCheckedChange={(checked) => setForm({ ...form, isFeatured: !!checked })}
              />
              <Label className="font-normal">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: !!checked })}
              />
              <Label className="font-normal">Active (visible in store)</Label>
            </div>
          </div>
          <Button onClick={saveProduct} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Variants and Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center gap-3 border rounded-lg p-3">
              <span className="flex-1 text-sm font-medium">{variant.variant_name}</span>
              <Input
                type="number"
                value={variant.stock_quantity}
                onChange={(e) => updateVariantStock(variant.id, parseInt(e.target.value) || 0)}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground">in stock</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => deleteVariant(variant.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-2">
            <Input
              placeholder="Variant name (e.g. Size L, Red)"
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newVariantStock}
              onChange={(e) => setNewVariantStock(e.target.value)}
              className="w-28"
            />
            <Button onClick={addVariant} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bulk Pricing Tiers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex items-center gap-3 border rounded-lg p-3">
              <Badge variant="secondary">{tier.min_quantity}+ units</Badge>
              <span className="flex-1 text-sm">{tier.discount_percent}% off</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => deleteTier(tier.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-2">
            <Input
              type="number"
              placeholder="Min quantity"
              value={newTierQty}
              onChange={(e) => setNewTierQty(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Discount %"
              value={newTierDiscount}
              onChange={(e) => setNewTierDiscount(e.target.value)}
            />
            <Button onClick={addTier} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
