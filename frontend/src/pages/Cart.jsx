import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineShoppingCart, HiOutlineTrash, HiArrowRight } from 'react-icons/hi2'
import { useCart } from '../context/CartContext.jsx'
import QuantityStepper from '../components/ui/QuantityStepper.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totals } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={HiOutlineShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start exploring our collections."
          actionLabel="Start shopping"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Shopping cart ({totals.itemCount})</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.lineId} className="flex gap-4 rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
              <Link to={`/product/${item.id}`} className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-ink-100">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-xs text-ink-500">{item.brand}</p>
                    <Link to={`/product/${item.id}`} className="text-sm font-semibold text-ink-900 hover:text-primary-600 line-clamp-2">
                      {item.title}
                    </Link>
                    {(item.color || item.size) && (
                      <p className="mt-1 text-xs text-ink-500">
                        {item.color && `Color: ${item.color}`} {item.size && `· Size: ${item.size}`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.lineId)}
                    aria-label="Remove item"
                    className="shrink-0 text-ink-400 hover:text-red-500"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.lineId, q)}
                    max={item.stock || 10}
                  />
                  <div className="text-right">
                    <p className="text-sm font-bold text-ink-900">{formatPrice(item.price * item.quantity)}</p>
                    {item.mrp > item.price && (
                      <p className="text-xs text-ink-400 line-through">{formatPrice(item.mrp * item.quantity)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-white border border-ink-100 p-5 shadow-card sticky top-24">
          <h2 className="font-bold text-ink-900 mb-4">Order summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal ({totals.itemCount} items)</span>
              <span className="text-ink-900 font-medium">{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.savings > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>You save</span>
                <span className="font-medium">{formatPrice(totals.savings)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-600">
              <span>Shipping</span>
              <span className="text-ink-900 font-medium">{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
            </div>
            {totals.shipping > 0 && (
              <p className="text-xs text-ink-500">Add {formatPrice(999 - totals.subtotal)} more for free shipping</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-ink-100 flex justify-between">
            <span className="font-bold text-ink-900">Total</span>
            <span className="font-bold text-lg text-ink-900">{formatPrice(totals.total)}</span>
          </div>
          <Button fullWidth size="lg" className="mt-5" onClick={() => navigate('/checkout')}>
            Proceed to checkout <HiArrowRight size={18} />
          </Button>
          <Link to="/products" className="mt-3 block text-center text-sm font-medium text-primary-600 hover:text-primary-700">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
