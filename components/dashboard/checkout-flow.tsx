'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { MapPin } from 'lucide-react'

type Address = {
  id: string
  label: string
  recipient_name: string
  address_line: string
  city: string
  state: string
  pincode: string
  is_default: boolean
}

type CartRow = {
  id: string
  quantity: number
  product: { name: string; base_price: number } | null
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export function CheckoutFlow() {
  const router = useRouter()
  const supabase = createClient()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [cartItems, setCartItems] = useState<CartRow[]>([])
  const [shippingRate, setShippingRate] = useState(0)
  const [taxPercent, setTaxPercent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (business) {
        const { data: addressRows } = await supabase
          .from('addresses')
          .select('*')
          .eq('business_id', business.id)
          .order('is_default', { ascending: false })

        setAddresses(addressRows || [])
        const defaultAddr = addressRows?.find((a) => a.is_default)
        if (defaultAddr) setSelectedAddressId(defaultAddr.id)
        else if (addressRows && addressRows.length > 0) setSelectedAddressId(addressRows[0].id)
      }

      const { data: cartRows } = await supabase
        .from('cart_items')
        .select('id, quantity, product:products(name, base_price)')
        .eq('profile_id', user.id)

      setCartItems((cartRows as unknown as CartRow[]) || [])

      const { data: siteSettings } = await supabase
        .from('site_settings')
        .select('default_shipping_rate, default_tax_percent')
        .limit(1)
        .maybeSingle()

      setShippingRate(siteSettings?.default_shipping_rate || 0)
      setTaxPercent(siteSettings?.default_tax_percent || 0)

      setLoading(false)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const taxAmount = 0 // recomputed below once subtotal is known
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.base_price || 0) * item.quantity,
    0
  )
  const computedTaxAmount = subtotal * (taxPercent / 100)
  const total = subtotal + shippingRate + computedTaxAmount

  async function handlePayNow() {
    setError(null)

    if (!selectedAddressId) {
      setError('Please select a delivery address')
      return
    }

    setPlacing(true)

    const createRes = await fetch('/api/checkout/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressId: selectedAddressId }),
    })

    const createData = await createRes.json()

    if (!createRes.ok) {
      setError(createData.error || 'Could not start checkout')
      setPlacing(false)
      return
    }

    const razorpay = new window.Razorpay({
      key: createData.keyId,
      amount: createData.amount,
      currency: 'INR',
      name: 'Selection House',
      description: `Order ${createData.orderNumber}`,
      order_id: createData.razorpayOrderId,
      handler: async function (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) {
        const verifyRes = await fetch('/api/checkout/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createData.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })

        if (verifyRes.ok) {
          router.push(`/dashboard/orders/${createData.orderId}`)
        } else {
          setError('Payment verification failed. Please contact support.')
        }
      },
      theme: { color: '#1e3a6b' },
      modal: {
        ondismiss: function () {
          setPlacing(false)
        },
      },
    })

    razorpay.open()
    setPlacing(false)
  }

  if (loading) {
    return <LoadingSpinner label="Preparing checkout..." />
  }

  if (cartItems.length === 0) {
    return (
      <div className="border rounded-xl p-12 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </h3>

            {addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No saved addresses. Please add one in Addresses before checking out.
              </p>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className="flex items-start gap-3 border rounded-lg p-3 cursor-pointer has-[:checked]:border-primary"
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium">{addr.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {addr.recipient_name}, {addr.address_line}, {addr.city}, {addr.state}{' '}
                        {addr.pincode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>
                    {item.product?.name || 'Unavailable'} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{((item.product?.base_price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-5 h-fit">
          <h3 className="font-semibold mb-4">Payment Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shippingRate > 0 ? `₹${shippingRate.toFixed(2)}` : 'Free'}</span>
            </div>
            {taxPercent > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax ({taxPercent}%)</span>
                <span>₹{computedTaxAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between font-bold text-lg border-t pt-3 mb-5">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          {error && <p className="text-sm text-destructive mb-3">{error}</p>}

          <Button
            className="w-full"
            size="lg"
            onClick={handlePayNow}
            disabled={placing || addresses.length === 0}
          >
            {placing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </div>
    </>
  )
}
