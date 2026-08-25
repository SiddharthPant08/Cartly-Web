import apiClient from './axiosClient'
import { withFallback } from './mockAdapter'
import { categories } from '../data/categories'

export function fetchCategories() {
  return withFallback(
    async () => {
      const response = await apiClient.get('/categories')
      return response.data.categories
    },
    () => categories
  )
}