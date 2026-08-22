import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedOrders } from '../data/orders'
import { fetchOrders, createOrder } from '../api/ordersApi'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useLocalStorage('cartly:orders', seedOrders)

  // Refresh from the API layer on mount — resolves with real data once the
  // Express API exists, otherwise quietly keeps whatever is in localStorage.
  useEffect(() => {
    let cancelled = false
    fetchOrders().then((remoteOrders) => {
      if (!cancelled && Array.isArray(remoteOrders) && remoteOrders.length) {
        setOrders(remoteOrders)
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeOrder = async ({ items, total, address, paymentMethod }) => {
    const order = await createOrder({ items, total, address, paymentMethod })
    setOrders((prev) => [order, ...prev])
    return order
  }

  const getOrderById = (id) => orders.find((o) => o.id === id)

  return <OrdersContext.Provider value={{ orders, placeOrder, getOrderById }}>{children}</OrdersContext.Provider>
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
