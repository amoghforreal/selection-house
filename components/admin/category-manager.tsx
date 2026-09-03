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
import { FolderTree, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function CategoryManager() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  async function loadCategories() {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addCategory() {
    if (!newName.trim()) return
    setSaving(true)

    const maxOrder = categories.reduce((max, c) => Math.max(max, c.display_order), 0)

    await supabase.from('categories').insert({
      name: newName,
      slug: slugify(newName),
      description: newDescription || null,
      display_order: maxOrder + 1,
    })

    setNewName('')
    setNewDescription('')
    setShowForm(false)
    setSaving(false)
    await loadCategories()
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('categories').update({ is_active: !current }).eq('id', id)
    await loadCategories()
  }

  async function deleteCategory(id: string) {
    await supabase.from('categories').delete().eq('id', id)
    await loadCategories()
  }

  if (loading) {
    return <LoadingSpinner label="Loading categories..." />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Football Accessories"
              />
              {newName && (
                <p className="text-xs text-muted-foreground">
                  Slug: /shop/{slugify(newName)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Short description shown on the category page"
              />
            </div>
            <Button onClick={addCategory} disabled={saving}>
              {saving ? 'Saving...' : 'Save Category'}
            </Button>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <FolderTree className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No categories yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between border rounded-xl p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{cat.name}</span>
                  {!cat.is_active && <Badge variant="secondary">Hidden</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">/shop/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleActive(cat.id, cat.is_active)}
                  title={cat.is_active ? 'Hide category' : 'Show category'}
                >
                  {cat.is_active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteCategory(cat.id)}
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
