'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Repeat, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { placeholderImage } from '@/lib/placeholder-image'

type WishlistRow = {
  id: string
  product: {
    id: string
    name: string
    slug: string
    base_price: number
    category: { slug: string } | null
  } | null
}

export function WishlistManager() {
  const [items, setItems] = useState<WishlistRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadWishlist() {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('wishlist_items')
      .select('id, product:products(id, name, slug, base_price, category:categories(slug))')
      .eq('profile_id', user.id)

    setItems((data as unknown as WishlistRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadWishlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function removeItem(id: string) {
    await supabase.from('wishlist_items').delete().eq('id', id)
    await loadWishlist()
  }

  if (loading) {
    return <LoadingSpinner label="Loading wishlist..." />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Saved for Reorder</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Products you order often, one tap away from reordering.
      </p>

      {items.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Repeat className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nothing saved for reorder yet.</p>
          <Button render={<Link href="/dashboard/catalogue" />}>Browse Catalogue</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-secondary">
                {item.product && (
                  <Image
                    src={placeholderImage(item.product.name, 500, 300)}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                  {item.product?.name || 'Product unavailable'}
                </h3>
                {item.product && (
                  <p className="text-lg font-bold text-primary mb-3">
                    ₹{item.product.base_price.toFixed(2)}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {item.product && (
                    <Button
                      size="sm"
                      className="flex-1"
                      render={
                        <Link
                          href={`/shop/${item.product.category?.slug || ''}/${item.product.slug}`}
                        />
                      }
                    >
                      View
                    </Button>
                  )}
                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive shrink-0"
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
