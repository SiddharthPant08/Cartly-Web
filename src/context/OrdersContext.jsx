import { createContext, useContext, useEffect, useState } from 'react'
import { fetchOrders, createOrder } from '../api/ordersApi'

const OrdersContext = createContext(null)

const normalizeOrder = (order) => ({
  id: order._id || order.id,
  date: order.createdAt || order.date,
  status: order.status || 'pending',
  total: order.total || 0,

  address:
    order.shippingAddress
      ? `${order.shippingAddress.fullName}, ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`
      : '',

  shippingAddress: order.shippingAddress,

  paymentMethod: order.paymentMethod,

  items: (order.items || []).map((item) => ({
    id: item.product?._id || item.product || item.id,
    title: item.title || item.product?.title || '',
    image: item.image || item.product?.images?.[0] || '',
    price: item.price || item.product?.price || 0,
    quantity: item.quantity || 1,
  })),
})

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadOrders = async () => {
      try {
        const remoteOrders = await fetchOrders()

        if (!cancelled) {
          setOrders(
            Array.isArray(remoteOrders)
              ? remoteOrders.map(normalizeOrder)
              : []
          )
        }
      } catch (error) {
        console.error('Failed to load orders:', error)

        if (!cancelled) {
          setOrders([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      cancelled = true
    }
  }, [])

  const placeOrder = async (orderData) => {
    const createdOrder = await createOrder(orderData)

    const normalizedOrder = normalizeOrder(createdOrder)

    setOrders((prev) => [normalizedOrder, ...prev])

    return normalizedOrder
  }

  const getOrderById = (id) => {
    return orders.find((order) => order.id === id)
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        placeOrder,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext)

  if (!ctx) {
    throw new Error('useOrders must be used within OrdersProvider')
  }

  return ctx
}