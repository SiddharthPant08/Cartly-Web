import apiClient from './axiosClient'

export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/products', {
    params,
  })

  return response.data
}

export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`)

  return response.data
}

// Backward-compatible functions used by existing frontend pages

export const fetchProducts = async (params = {}) => {
  const data = await getProducts({
    ...params,
    limit: params.limit || 100,
  })

  return data.products || []
}

export const fetchProductById = async (id) => {
  const data = await getProductById(id)

  return data.product
}

export const fetchProductsByTag = async (tag) => {
  const data = await getProducts({
    limit: 100,
  })

  return (data.products || []).filter((product) =>
    product.tags?.includes(tag)
  )
}
export const fetchRelatedProducts = async (product) => {
  const data = await getProducts({
    category: product.category,
    limit: 100,
  })

  return (data.products || [])
    .filter((item) => item.legacyId !== product.legacyId)
    .slice(0, 4)
}