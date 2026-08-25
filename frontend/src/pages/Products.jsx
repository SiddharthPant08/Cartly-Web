
import { withFallback } from './mockAdapter'
import { categories } from '../data/categories'

export function fetchCategories() {
  return withFallback(
    () => apiClient.get('/categories'),
    () => categories
  )
}
