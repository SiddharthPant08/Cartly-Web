import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useLocalStorage('cartly:wishlist', [])

  const isWishlisted = (productId) => items.some((i) => i.id === productId)

  const toggleWishlist = (product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id)
      if (exists) {
        toast('Removed from wishlist', { icon: '💔' })
        return prev.filter((i) => i.id !== product.id)
      }
      toast.success('Added to wishlist')
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          image: product.images?.[0],
          price: product.price,
          mrp: product.mrp,
          brand: product.brand,
          rating: product.rating,
        },
      ]
    })
  }

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
