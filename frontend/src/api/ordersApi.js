import apiClient from './axiosClient'

export async function fetchOrders() {
  const response = await apiClient.get('/orders')
  return response.data
}

export async function createOrder(payload) {
  const response = await apiClient.post('/orders', payload)
  return response.data
}