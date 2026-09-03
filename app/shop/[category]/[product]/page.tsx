import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Lock, Package, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

function titleCaseFromSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

type PageProps = {
  params: Promise<{ category: string; product: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product } = await params
  const name = titleCaseFromSlug(product)
  return {
    title: name,
    description: `Wholesale ${name} at Selection House. Bulk pricing for shop owners.`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { category: categorySlug, product: productSlug } = await params
  const categoryDisplayName = titleCaseFromSlug(categorySlug)

  type ProductRow = {
    id: string
    name: string
    slug: string
    description: string | null
    brand: string | null
    base_price: number
    moq: number
    sku: string | null
  }
  type PricingTier = { id: string; min_quantity: number; discount_percent: number }
  type Variant = { id: string; variant_name: string; stock_quantity: number }

  let product: ProductRow | null = null
  let pricingTiers: PricingTier[] = []
  let variants: Variant[] = []
  let isLoggedIn = false
  let dbConnected = true

  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    isLoggedIn = !!user

    const { data: productRow } = await supabase
      .from('products')
      .select('id, name, slug, description, brand, base_price, moq, sku')
      .eq('slug', productSlug)
      .eq('is_active', true)
      .maybeSingle()

    product = productRow

    if (product) {
      const [{ data: tierRows }, { data: variantRows }] = await Promise.all([
        supabase
          .from('pricing_tiers')
          .select('id, min_quantity, discount_percent')
          .eq('product_id', product.id)
          .order('min_quantity', { ascending: true }),
        supabase
          .from('product_variants')
          .select('id, variant_name, stock_quantity')
          .eq('product_id', product.id)
          .eq('is_active', true),
      ])

      pricingTiers = tierRows || []
      variants = variantRows || []
    }
  } catch {
    dbConnected = false
  }

  // Database not connected yet (placeholder Supabase credentials): show a
  // friendly placeholder instead of a hard 404, so the page still demos correctly.
  if (!dbConnected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Package className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Data Not Connected Yet</h1>
        <p className="text-muted-foreground mb-6">
          This page will show real product details once the store database is connected.
        </p>
        <Button render={<Link href={`/shop/${categorySlug}`} />}>
          Back to {categoryDisplayName}
        </Button>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/shop/${categorySlug}`} className="hover:text-primary transition-colors">
          {categoryDisplayName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image placeholder */}
        <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Product photo placeholder</span>
        </div>

        {/* Details */}
        <div>
          {product.brand && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.brand}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold mt-1 mb-3">{product.name}</h1>

          {product.sku && (
            <p className="text-xs text-muted-foreground mb-4">SKU: {product.sku}</p>
          )}

          {product.description && (
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="text-sm">Minimum Order Quantity: {product.moq} units</span>
          </div>

          {isLoggedIn ? (
            <div className="border rounded-xl p-5 mb-6">
              <span className="text-3xl font-bold text-primary">
                ₹{product.base_price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground ml-2">per unit</span>

              {pricingTiers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">Bulk Pricing</p>
                  <div className="space-y-1">
                    {pricingTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {tier.min_quantity}+ units
                        </span>
                        <Badge variant="secondary">
                          {tier.discount_percent}% off
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {variants.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">Available Variants</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant) => (
                      <Badge key={variant.id} variant="outline">
                        {variant.variant_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full mt-5" size="lg">
                Add to Cart
              </Button>
            </div>
          ) : (
            <div className="border rounded-xl p-5 mb-6 text-center">
              <Lock className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Login to view wholesale pricing and place an order
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button render={<Link href="/login" />}>Login</Button>
                <Button variant="outline" render={<Link href="/register" />}>
                  Register Your Business
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
