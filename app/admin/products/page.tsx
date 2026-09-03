import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

type ProductRow = {
  id: string
  name: string
  slug: string
  base_price: number
  is_active: boolean
  is_featured: boolean
  category: { name: string } | null
}

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, base_price, is_active, is_featured, category:categories(name)')
    .order('created_at', { ascending: false })

  const rows = (products as unknown as ProductRow[]) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button render={<Link href="/admin/products/new" />}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Package className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No products yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="flex items-center justify-between border rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{product.name}</span>
                  {product.is_featured && <Badge variant="secondary">Featured</Badge>}
                  {!product.is_active && <Badge variant="outline">Hidden</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {product.category?.name || 'Uncategorized'}
                </p>
              </div>
              <span className="font-semibold text-sm">₹{product.base_price.toFixed(2)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
