'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Lock, ShieldCheck } from 'lucide-react'
import { SaveForReorderButton } from '@/components/shop/save-for-reorder-button'

type PricingTier = { id: string; min_quantity: number; discount_percent: number }
type Variant = { id: string; variant_name: string; stock_quantity: number }

export function ProductPricing({
  productId,
  basePrice,
  moq,
  pricingTiers,
  variants,
  isLoggedIn,
}: {
  productId: string
  basePrice: number
  moq: number
  pricingTiers: PricingTier[]
  variants: Variant[]
  isLoggedIn: boolean
}) {
  const [quantity, setQuantity] = useState(moq)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? variants[0].id : null
  )
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const supabase = createClient()

  const activeDiscount = useMemo(() => {
    const applicable = pricingTiers
      .filter((tier) => quantity >= tier.min_quantity)
      .sort((a, b) => b.min_quantity - a.min_quantity)
    return applicable.length > 0 ? applicable[0].discount_percent : 0
  }, [quantity, pricingTiers])

  const unitPrice = basePrice * (1 - activeDiscount / 100)
  const totalPrice = unitPrice * quantity

  function updateQuantity(newQty: number) {
    if (newQty < moq) return
    setQuantity(newQty)
  }

  async function handleAddToCart() {
    if (!isLoggedIn) return
    setAdding(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('cart_items').upsert(
        {
          profile_id: user.id,
          product_id: productId,
          variant_id: selectedVariantId,
          quantity,
        },
        { onConflict: 'profile_id,product_id,variant_id' }
      )
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    }

    setAdding(false)
  }

  return (
    <div className="border rounded-xl p-5 mb-6">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-primary">₹{unitPrice.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">per unit</span>
      </div>
      {activeDiscount > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground line-through">
            ₹{basePrice.toFixed(2)}
          </span>
          <Badge className="bg-accent text-accent-foreground">
            {activeDiscount}% off applied
          </Badge>
        </div>
      )}

      {pricingTiers.length > 0 && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm font-semibold mb-2">Bulk Pricing</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {moq}-{pricingTiers[0]?.min_quantity - 1 || ''} units
              </span>
              <span>₹{basePrice.toFixed(2)} / unit</span>
            </div>
            {pricingTiers.map((tier, idx) => {
              const nextTier = pricingTiers[idx + 1]
              const tierUnitPrice = basePrice * (1 - tier.discount_percent / 100)
              return (
                <div key={tier.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {tier.min_quantity}
                    {nextTier ? `-${nextTier.min_quantity - 1}` : '+'} units
                  </span>
                  <span
                    className={
                      quantity >= tier.min_quantity && quantity < (nextTier?.min_quantity ?? Infinity)
                        ? 'font-semibold text-primary'
                        : ''
                    }
                  >
                    ₹{tierUnitPrice.toFixed(2)} / unit
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {variants.length > 0 && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm font-semibold mb-2">Select Variant</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  selectedVariantId === variant.id
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'hover:border-primary'
                }`}
              >
                {variant.variant_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 pb-4 border-b">
        <p className="text-sm font-semibold mb-2">Quantity (MOQ: {moq} units)</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(quantity - 1)}
            disabled={quantity <= moq}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => updateQuantity(parseInt(e.target.value) || moq)}
            className="w-20 text-center"
          />
          <Button variant="outline" size="icon" onClick={() => updateQuantity(quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">Total for {quantity} units</span>
        <span className="text-xl font-bold">₹{totalPrice.toFixed(2)}</span>
      </div>

      {isLoggedIn ? (
        <div className="flex gap-2">
          <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={adding}>
            {adding ? 'Adding...' : added ? 'Added to Cart' : 'Add to Cart'}
          </Button>
          <SaveForReorderButton productId={productId} isLoggedIn={isLoggedIn} variant="icon" />
        </div>
      ) : (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
            <Lock className="h-3.5 w-3.5" />
            Login to place an order
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button render={<Link href="/login" />}>Login</Button>
            <Button variant="outline" render={<Link href="/register" />}>
              Register Your Business
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
        <ShieldCheck className="h-4 w-4 text-accent" />
        <span className="text-xs text-muted-foreground">
          Wholesale pricing, genuine products, since 1989
        </span>
      </div>
    </div>
  )
}
