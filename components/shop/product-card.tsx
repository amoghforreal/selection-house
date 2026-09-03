import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { placeholderImage } from '@/lib/placeholder-image'

type Product = {
  id: string
  name: string
  slug: string
  brand: string | null
  base_price: number
  moq: number
  is_featured: boolean
  cover_image_url?: string | null
}

export function ProductCard({
  product,
  categorySlug,
}: {
  product: Product
  categorySlug: string
  isLoggedIn?: boolean
}) {
  return (
    <Link
      href={`/shop/${categorySlug}/${product.slug}`}
      className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:border-primary hover:shadow-md transition-all"
    >
      <div className="relative aspect-square bg-secondary">
        <Image
          src={product.cover_image_url || placeholderImage(product.slug, 500, 500)}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {product.is_featured && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        {product.brand && (
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.brand}
          </span>
        )}
        <h3 className="font-medium text-sm leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-xs text-muted-foreground">MOQ: {product.moq} units</p>

        <div className="mt-2">
          <span className="text-lg font-bold text-primary">
            ₹{product.base_price.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground ml-1">/ unit</span>
        </div>
      </div>
    </Link>
  )
}
