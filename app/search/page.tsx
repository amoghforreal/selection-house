import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/product-card'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search results for "${q}"` : 'Search',
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = (q || '').trim()

  type ProductRow = {
    id: string
    name: string
    slug: string
    brand: string | null
    base_price: number
    moq: number
    is_featured: boolean
    cover_image_url: string | null
    category: { slug: string } | null
  }

  let results: ProductRow[] = []

  if (query) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select(
        'id, name, slug, brand, base_price, moq, is_featured, cover_image_url, category:categories(slug)'
      )
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)

    results = (data as unknown as ProductRow[]) || []
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {query ? `${results.length} product${results.length === 1 ? '' : 's'} found` : 'Enter a search term to find products'}
      </p>

      {query && results.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No products matched your search.</p>
          <p className="text-sm text-muted-foreground">
            Try a different term, or{' '}
            <Link href="/shop" className="text-primary hover:underline">
              browse all categories
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categorySlug={product.category?.slug || ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}
