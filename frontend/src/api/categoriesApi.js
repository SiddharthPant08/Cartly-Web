import apiClient from './axiosClient'

export async function fetchCategories() {
  const response = await apiClient.get('/categories')
  return response.data.categories
}