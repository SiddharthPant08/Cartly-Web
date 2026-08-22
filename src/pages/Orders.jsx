import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineClipboardDocumentList, HiChevronDown } from 'react-icons/hi2'
import { useOrders } from '../context/OrdersContext.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Badge from '../components/ui/Badge.jsx'
import { formatPrice } from '../utils/format'

const statusTone = {
  Delivered: 'success',
  Processing: 'primary',
  Shipped: 'primary',
  Cancelled: 'danger',
}

export default function Orders() {
  const { orders } = useOrders()
  const [expanded, setExpanded] = useState(null)

  if (orders.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={HiOutlineClipboardDocumentList}
          title="No orders yet"
          description="Your order history will show up here once you make a purchase."
          actionLabel="Start shopping"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">My orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const isOpen = expanded === order.id
          return (
            <div key={order.id} className="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden sm:flex -space-x-3">
                    {order.items.slice(0, 3).map((item) => (
                      <img
                        key={item.id}
                        src={item.image}
                        alt=""
                        className="h-12 w-12 rounded-xl object-cover border-2 border-white"
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{order.id}</p>
                    <p className="text-xs text-ink-500">
                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge tone={statusTone[order.status] || 'neutral'}>{order.status}</Badge>
                  <span className="font-bold text-ink-900 text-sm hidden sm:inline">{formatPrice(order.total)}</span>
                  <HiChevronDown className={`text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-ink-100 p-4 sm:p-5 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} className="text-sm font-medium text-ink-900 hover:text-primary-600 line-clamp-1">
                          {item.title}
                        </Link>
                        <p className="text-xs text-ink-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-ink-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-ink-100 flex justify-between text-sm">
                    <span className="text-ink-500">Delivery address</span>
                    <span className="text-ink-800 text-right max-w-[60%]">{order.address}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-ink-900">
                    <span>Total paid</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
