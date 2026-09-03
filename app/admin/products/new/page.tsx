'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    brand: '',
    basePrice: '',
    moq: '1',
    sku: '',
    isFeatured: false,
  })

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      setCategories(data || [])
    }
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit() {
    setError(null)

    if (!form.name.trim() || !form.categoryId || !form.basePrice) {
      setError('Name, category, and price are required')
      return
    }

    setSaving(true)

    const { data, error: insertError } = await supabase
      .from('products')
      .insert({
        category_id: form.categoryId,
        name: form.name,
        slug: slugify(form.name),
        description: form.description || null,
        brand: form.brand || null,
        base_price: parseFloat(form.basePrice),
        moq: parseInt(form.moq) || 1,
        sku: form.sku || null,
        is_featured: form.isFeatured,
      })
      .select('id')
      .single()

    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    router.push(`/admin/products/${data.id}`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Professional Hockey Stick"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) => setForm({ ...form, categoryId: value ?? '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
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
              <Label>MOQ (Minimum Order Quantity)</Label>
              <Input
                type="number"
                value={form.moq}
                onChange={(e) => setForm({ ...form, moq: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.isFeatured}
              onCheckedChange={(checked) => setForm({ ...form, isFeatured: !!checked })}
            />
            <Label className="font-normal">Feature this product on the homepage</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Create Product'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
