import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineClipboardDocumentList,
  HiChevronDown,
} from 'react-icons/hi2'
import toast from 'react-hot-toast'

import EmptyState from '../components/ui/EmptyState.jsx'
import Badge from '../components/ui/Badge.jsx'
import { formatPrice } from '../utils/format'
import apiClient from '../api/axiosClient.js'

const statusTone = {
  delivered: 'success',
  processing: 'primary',
  shipped: 'primary',
  cancelled: 'danger',
  confirmed: 'primary',
  pending: 'neutral',
}

const statusLabel = {
  delivered: 'Delivered',
  processing: 'Processing',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
  pending: 'Pending',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)

        const response = await apiClient.get('/orders')

        setOrders(response.data.orders || [])
      } catch (error) {
        console.error('Fetch orders error:', error)

        toast.error(
          error.response?.data?.message ||
            'Unable to load your orders'
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="container-page py-10">
        <h1 className="text-2xl font-bold text-ink-900 mb-6">
          My orders
        </h1>

        <div className="rounded-2xl bg-white border border-ink-100 shadow-card p-8 text-center">
          <p className="text-ink-500">
            Loading your orders...
          </p>
        </div>
      </div>
    )
  }

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
      <h1 className="text-2xl font-bold text-ink-900 mb-6">
        My orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const isOpen = expanded === order._id

          const status = order.status?.toLowerCase() || 'pending'

          return (
            <div
              key={order._id}
              className="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden"
            >
              {/* Order header */}
              <button
                onClick={() =>
                  setExpanded(isOpen ? null : order._id)
                }
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
              >
                <div className="flex items-center gap-4 min-w-0">

                  {/* Product images */}
                  <div className="hidden sm:flex -space-x-3">
                    {order.items
                      .slice(0, 3)
                      .map((item) => (
                        <img
                          key={item.product?._id || item.product}
                          src={item.image}
                          alt=""
                          className="h-12 w-12 rounded-xl object-cover border-2 border-white"
                        />
                      ))}
                  </div>

                  {/* Order info */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>

                    <p className="text-xs text-ink-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}

                      {' · '}

                      {order.items.length}{' '}
                      item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">

                  <Badge
                    tone={
                      statusTone[status] || 'neutral'
                    }
                  >
                    {statusLabel[status] || status}
                  </Badge>

                  <span className="font-bold text-ink-900 text-sm hidden sm:inline">
                    {formatPrice(order.total)}
                  </span>

                  <HiChevronDown
                    className={`text-ink-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Order details */}
              {isOpen && (
                <div className="border-t border-ink-100 p-4 sm:p-5 space-y-4">

                  {/* Items */}
                  {order.items.map((item) => (
                    <div
                      key={item.product?._id || item.product}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="h-14 w-14 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${
                          item.product?.legacyId ||
                          item.product?._id ||
                          item.product
                        }`}
                          className="text-sm font-medium text-ink-900 hover:text-primary-600 line-clamp-1"
                        >
                          {item.title}
                        </Link>

                        <p className="text-xs text-ink-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-ink-900 shrink-0">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </span>
                    </div>
                  ))}

                  {/* Address */}
                  <div className="pt-3 border-t border-ink-100">
                    <p className="text-sm text-ink-500 mb-1">
                      Delivery address
                    </p>

                    <p className="text-sm text-ink-800">
                      {order.shippingAddress.fullName}
                    </p>

                    <p className="text-sm text-ink-800">
                      {order.shippingAddress.addressLine},{' '}
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>

                    <p className="text-sm text-ink-800">
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">
                      Payment method
                    </span>

                    <span className="font-medium text-ink-800 uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t border-ink-100 flex justify-between text-sm font-bold text-ink-900">
                    <span>Total</span>

                    <span>
                      {formatPrice(order.total)}
                    </span>
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