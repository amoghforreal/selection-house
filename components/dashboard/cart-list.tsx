'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { placeholderImage } from '@/lib/placeholder-image'

type CartRow = {
  id: string
  quantity: number
  product_id: string
  variant_id: string | null
  product: {
    id: string
    name: string
    slug: string
    base_price: number
    moq: number
  } | null
}

export function CartList() {
  const [items, setItems] = useState<CartRow[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const supabase = createClient()

  async function loadCart() {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('cart_items')
      .select(
        'id, quantity, product_id, variant_id, product:products(id, name, slug, base_price, moq)'
      )
      .eq('profile_id', user.id)

    setItems((data as unknown as CartRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function updateQuantity(cartItemId: string, newQuantity: number) {
    if (newQuantity < 1) return
    setUpdatingId(cartItemId)
    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', cartItemId)
    await loadCart()
    setUpdatingId(null)
  }

  async function removeItem(cartItemId: string) {
    setUpdatingId(cartItemId)
    await supabase.from('cart_items').delete().eq('id', cartItemId)
    await loadCart()
    setUpdatingId(null)
  }

  if (loading) {
    return <LoadingSpinner label="Loading your cart..." />
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-xl p-12 text-center">
        <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button render={<Link href="/dashboard/catalogue" />}>Browse Catalogue</Button>
      </div>
    )
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.base_price || 0) * item.quantity,
    0
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 flex items-center gap-4"
          >
            <div className="relative h-16 w-16 rounded-lg bg-secondary shrink-0 overflow-hidden">
              {item.product && (
                <Image
                  src={placeholderImage(item.product.name, 200, 200)}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {item.product?.name || 'Product unavailable'}
              </p>
              {item.product && (
                <p className="text-xs text-muted-foreground">
                  MOQ: {item.product.moq} units &middot; ₹{item.product.base_price.toFixed(2)} / unit
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={updatingId === item.id}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={updatingId === item.id}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              disabled={updatingId === item.id}
              onClick={() => removeItem(item.id)}
              className="shrink-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="border rounded-xl p-5 h-fit">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Shipping and tax calculated at checkout
        </p>
        <Button className="w-full" render={<Link href="/dashboard/checkout" />}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}
