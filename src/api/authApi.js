import apiClient from './axiosClient'
import { withFallback } from './mockAdapter'

function buildDummyUser({ name, email }) {
  const displayName = name || email.split('@')[0].replace(/[._]/g, ' ')
  return {
    user: {
      name: displayName.replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      avatar: null,
      joined: new Date().toISOString(),
    },
    // Fake JWT-shaped token so the request interceptor has something to attach
    // once real auth endpoints exist, this is replaced by the server's token.
    token: `dummy.${btoa(email)}.${Date.now()}`,
  }
}

export function loginRequest(credentials) {
  return withFallback(
    () => apiClient.post('/auth/login', credentials),
    () => buildDummyUser(credentials),
    500
  )
}

export function registerRequest(payload) {
  return withFallback(
    () => apiClient.post('/auth/register', payload),
    () => buildDummyUser(payload),
    500
  )
}

export function fetchProfile() {
  return withFallback(
    () => apiClient.get('/auth/me'),
    () => {
      const stored = window.localStorage.getItem('cartly:user')
      return stored ? JSON.parse(stored) : null
    },
    200
  )
}
