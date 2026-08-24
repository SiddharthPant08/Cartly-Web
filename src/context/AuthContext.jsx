import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { updateProfileApi } from '../api/profileApi'
import { loginRequest, registerRequest } from '../api/authApi'

import {
  getAddresses,
  addAddressApi,
  removeAddressApi,
} from '../api/addressApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('cartly:user', null)
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses()
        setAddresses(data.addresses || [])
      } catch (error) {
        console.error('Failed to load addresses:', error)
      }
    }

    if (user) {
      loadAddresses()
    } else {
      setAddresses([])
    }
  }, [user])

  const login = async (credentials) => {
    const { user: loggedInUser, token } =
      await loginRequest(credentials)

    window.localStorage.setItem('cartly:token', token)

    setUser(loggedInUser)

    toast.success('Welcome back!')

    return loggedInUser
  }

  const register = async (payload) => {
    const { user: newUser, token } =
      await registerRequest(payload)

    window.localStorage.setItem('cartly:token', token)

    setUser(newUser)

    toast.success('Account created — welcome to Cartly!')

    return newUser
  }

  const logout = () => {
    setUser(null)

    setAddresses([])

    window.localStorage.removeItem('cartly:token')

    toast('Logged out', { icon: '👋' })
  }

  const updateProfile = async (updates) => {
  try {
    const data = await updateProfileApi(updates)

    setUser(data.user)

    toast.success('Profile updated')

    return data.user
  } catch (error) {
    console.error('Update profile error:', error)

    toast.error(
      error.response?.data?.message ||
        'Unable to update profile'
    )

    throw error
  }
}

  const addAddress = async (address) => {
    try {
      const data = await addAddressApi(address)

      const newAddresses = data.addresses || []

      setAddresses(newAddresses)

      toast.success('Address added')

      return newAddresses[newAddresses.length - 1]
    } catch (error) {
      console.error('Add address error:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to add address'
      )

      throw error
    }
  }

  const removeAddress = async (id) => {
    try {
      const data = await removeAddressApi(id)

      setAddresses(data.addresses || [])

      toast('Address removed', {
        icon: '🗑️',
      })
    } catch (error) {
      console.error('Remove address error:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to remove address'
      )
    }
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

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return ctx
}