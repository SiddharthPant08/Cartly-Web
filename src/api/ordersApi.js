import apiClient from './axiosClient'
import { withFallback } from './mockAdapter'
import { seedOrders } from '../data/orders'

function buildDummyOrder({ items, total, address, paymentMethod }) {
  return {
    id: `CARTLY-${Math.floor(10000 + Math.random() * 89999)}`,
    date: new Date().toISOString(),
    status: 'Processing',
    total,
    items,
    address,
    paymentMethod,
  }
}

export function fetchOrders() {
  return withFallback(
    () => apiClient.get('/orders'),
    () => {
      const stored = window.localStorage.getItem('cartly:orders')
      return stored ? JSON.parse(stored) : seedOrders
    },
    300
  )
}

export function createOrder(payload) {
  return withFallback(
    () => apiClient.post('/orders', payload),
    () => buildDummyOrder(payload),
    700
  )
}
