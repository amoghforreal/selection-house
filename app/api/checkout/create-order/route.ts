import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRazorpayClient } from '@/lib/razorpay'

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { addressId } = body

  if (!addressId) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  const { data: address } = await supabase
    .from('addresses')
    .select('id')
    .eq('id', addressId)
    .eq('business_id', business.id)
    .maybeSingle()

  if (!address) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  }

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('id, quantity, product_id, variant_id, product:products(id, name, base_price)')
    .eq('profile_id', user.id)

  type CartRow = {
    id: string
    quantity: number
    product_id: string
    variant_id: string | null
    product: { id: string; name: string; base_price: number } | null
  }

  const rows = (cartItems as unknown as CartRow[]) || []

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Apply bulk pricing tiers per product where applicable.
  let subtotal = 0
  const orderItemsPayload = []

  for (const item of rows) {
    if (!item.product) continue

    const { data: tiers } = await supabase
      .from('pricing_tiers')
      .select('min_quantity, discount_percent')
      .eq('product_id', item.product.id)
      .lte('min_quantity', item.quantity)
      .order('min_quantity', { ascending: false })
      .limit(1)

    const discountPercent = tiers && tiers.length > 0 ? tiers[0].discount_percent : 0
    const unitPrice = item.product.base_price * (1 - discountPercent / 100)
    const lineTotal = unitPrice * item.quantity

    subtotal += lineTotal

    orderItemsPayload.push({
      product_id: item.product.id,
      variant_id: item.variant_id,
      product_name: item.product.name,
      variant_name: null,
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: lineTotal,
    })
  }

  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('default_shipping_rate, default_tax_percent')
    .limit(1)
    .maybeSingle()

  const shippingAmount = siteSettings?.default_shipping_rate || 0
  const taxAmount = subtotal * ((siteSettings?.default_tax_percent || 0) / 100)
  const totalAmount = subtotal + shippingAmount + taxAmount

  const orderNumber = `SH-${Date.now()}`

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      business_id: business.id,
      address_id: addressId,
      subtotal,
      shipping_amount: shippingAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message || 'Could not create order' }, { status: 500 })
  }

  const itemsWithOrderId = orderItemsPayload.map((item) => ({
    ...item,
    order_id: order.id,
  }))

  await supabase.from('order_items').insert(itemsWithOrderId)

  const razorpay = getRazorpayClient()
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // paise
    currency: 'INR',
    receipt: orderNumber,
  })

  await supabase
    .from('orders')
    .update({ razorpay_order_id: razorpayOrder.id })
    .eq('id', order.id)

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    orderNumber,
  })
}
