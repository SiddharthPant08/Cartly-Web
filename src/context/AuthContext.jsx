import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { loginRequest, registerRequest } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('cartly:user', null)
  const [addresses, setAddresses] = useLocalStorage('cartly:addresses', [
    {
      id: 'addr1',
      name: 'Aisha Rao',
      line1: '42 Palm Grove Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
      phone: '9876543210',
      isDefault: true,
    },
  ])

  // Goes through the Axios API layer — hits a real endpoint once the Express
  // API exists, falls back to dummy auth until then. See src/api/authApi.js.
  const login = async (credentials) => {
    const { user: loggedInUser, token } = await loginRequest(credentials)
    window.localStorage.setItem('cartly:token', token)
    setUser(loggedInUser)
    toast.success('Welcome back!')
    return loggedInUser
  }

  const register = async (payload) => {
    const { user: newUser, token } = await registerRequest(payload)
    window.localStorage.setItem('cartly:token', token)
    setUser(newUser)
    toast.success('Account created — welcome to Cartly!')
    return newUser
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('cartly:token')
    toast('Logged out', { icon: '👋' })
  }

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
    toast.success('Profile updated')
  }

  const addAddress = (address) => {
    const newAddress = { ...address, id: `addr${Date.now()}` }
    setAddresses((prev) => [...prev, newAddress])
    toast.success('Address added')
    return newAddress
  }

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast('Address removed', { icon: '🗑️' })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        addresses,
        addAddress,
        removeAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
