import axios from 'axios'
import toast from 'react-hot-toast'

// Base URL will point at the Node/Express API once it exists.
// Falls back to a placeholder so the app can run standalone with dummy data.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT (once auth is backed by a real API) from localStorage automatically.
apiClient.interceptors.request.use((config) => {
  try {
    const token = window.localStorage.getItem('cartly:token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    // localStorage unavailable (SSR/private mode) - proceed without auth header
  }
  return config
})

// Centralized error handling so every api/* module doesn't repeat try/catch UI logic.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response
    const message = isNetworkError
      ? 'Backend not connected yet — using local data.'
      : error.response?.data?.message || 'Something went wrong. Please try again.'

    // Network errors are expected until the Express API is live; don't spam toasts for those.
    if (!isNetworkError && error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
