import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/product-card'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

function titleCaseFromSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

type PageProps = {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const name = titleCaseFromSlug(category)
  return {
    title: name,
    description: `Wholesale ${name} at Selection House. Bulk pricing for shop owners.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params
  const displayName = titleCaseFromSlug(categorySlug)

  let products: Array<{
    id: string
    name: string
    slug: string
    brand: string | null
    base_price: number
    moq: number
    is_featured: boolean
    cover_image_url: string | null
  }> = []

  try {
    const supabase = await createClient()

    const { data: categoryRow } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()

    if (categoryRow) {
      const { data: productRows } = await supabase
        .from('products')
        .select('id, name, slug, brand, base_price, moq, is_featured, cover_image_url')
        .eq('category_id', categoryRow.id)
        .eq('is_active', true)

      products = productRows || []
    }
  } catch {
    products = []
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{displayName}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
      <p className="text-muted-foreground mb-8">
        {products.length} product{products.length === 1 ? '' : 's'} available
      </p>

      {products.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-2">
            No products found in this category yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Check back soon, or contact us directly for availability.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} categorySlug={categorySlug} />
          ))}
        </div>
      )}
    </div>
  )
}
