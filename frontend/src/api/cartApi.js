import apiClient from './axiosClient'

export const getCart = async () => {
  const response = await apiClient.get('/cart')
  return response.data
}

export const addToCartApi = async (productId, quantity = 1) => {
  const response = await apiClient.post('/cart', {
    productId,
    quantity,
  })

  return response.data
}

export const updateCartItemApi = async (productId, quantity) => {
  const response = await apiClient.put(`/cart/${productId}`, {
    quantity,
  })

  return response.data
}

export const removeFromCartApi = async (productId) => {
  const response = await apiClient.delete(`/cart/${productId}`)
  return response.data
}

export const clearCartApi = async () => {
  const response = await apiClient.delete('/cart')
  return response.data
}