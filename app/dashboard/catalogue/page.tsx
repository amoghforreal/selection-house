import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Lock } from 'lucide-react'
import Image from 'next/image'
import { placeholderImage } from '@/lib/placeholder-image'

export const dynamic = 'force-dynamic'

type ProductRow = {
  id: string
  name: string
  slug: string
  brand: string | null
  base_price: number
  moq: number
  category_id: string
  categories: { name: string; slug: string } | null
}

export default async function DashboardCataloguePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, brand, base_price, moq, category_id, categories(name, slug)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })

  const rows = (products as unknown as ProductRow[]) || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Browse Catalogue</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Full wholesale pricing, ready to add to your cart.
      </p>

      {rows.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">
            No products available yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Products will appear here once the store catalogue is connected.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all"
            >
              <div className="relative aspect-video bg-secondary">
                <Image
                  src={placeholderImage(product.slug, 500, 300)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                {product.categories && (
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.categories.name}
                  </span>
                )}
                <h3 className="font-medium text-sm mt-1 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  MOQ: {product.moq} units
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ₹{product.base_price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    render={
                      <Link
                        href={`/shop/${product.categories?.slug || ''}/${product.slug}`}
                      />
                    }
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        Prices shown are exclusive wholesale pricing for your approved business account.
      </div>
    </div>
  )
}
