import { CartList } from '@/components/dashboard/cart-list'

export default function CartPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <CartList />
    </div>
  )
}
