import apiClient from './axiosClient'
import { withFallback } from './mockAdapter'
import { products, getProductById as findById, getRelatedProducts as findRelated, getProductsByTag as findByTag } from '../data/products'

export function fetchProducts(params = {}) {
  return withFallback(
    () => apiClient.get('/products', { params }),
    () => products
  )
}

export function fetchProductById(id) {
  return withFallback(
    () => apiClient.get(`/products/${id}`),
    () => findById(id)
  )
}

export function fetchRelatedProducts(product, limit = 6) {
  return withFallback(
    () => apiClient.get(`/products/${product.id}/related`, { params: { limit } }),
    () => findRelated(product, limit)
  )
}

export function fetchProductsByTag(tag) {
  return withFallback(
    () => apiClient.get('/products', { params: { tag } }),
    () => findByTag(tag)
  )
}
