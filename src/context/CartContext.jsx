import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  getCart,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
} from '../api/cartApi'

const CartContext = createContext(null)

const normalizeItem = (item) => {
  const product = item.product

  return {
    lineId: product.legacyId || product._id,
    id: product._id,
    legacyId: product.legacyId,
    title: product.title,
    image: product.images?.[0],
    price: product.price,
    mrp: product.originalPrice || product.price,
    brand: product.brand,
    stock: product.stock,
    quantity: item.quantity,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const loadCart = async () => {
      try {
        const data = await getCart()

        const cartItems = data.cart?.items || []

        setItems(
          cartItems
            .filter((item) => item.product)
            .map(normalizeItem)
        )
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const addToCart = async (product, quantity = 1, variant = {}) => {
    try {
      const productId = product._id || product.mongoId

      if (!productId) {
        throw new Error('Product does not have a MongoDB ID')
      }

      const data = await addToCartApi(productId, quantity)

      const cartItems = data.cart?.items || []

      setItems(
        cartItems
          .filter((item) => item.product)
          .map(normalizeItem)
      )

      toast.success(
        `${product.title.length > 28
          ? product.title.slice(0, 28) + '…'
          : product.title} added to cart`
      )
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Unable to add product to cart')
    }
  }

  const removeFromCart = async (lineId, opts = {}) => {
    try {
      const item = items.find((item) => item.lineId === lineId)

      if (!item) return

      await removeFromCartApi(item.id)

      setItems((prev) =>
        prev.filter((item) => item.lineId !== lineId)
      )

      if (!opts.silent) {
        toast('Removed from cart', { icon: '🗑️' })
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
      toast.error('Unable to remove product')
    }
  }

  const updateQuantity = async (lineId, quantity) => {
    if (quantity < 1) return

    try {
      const item = items.find((item) => item.lineId === lineId)

      if (!item) return

      const data = await updateCartItemApi(item.id, quantity)

      const cartItems = data.cart?.items || []

      setItems(
        cartItems
          .filter((item) => item.product)
          .map(normalizeItem)
      )
    } catch (error) {
      console.error('Update cart error:', error)
      toast.error('Unable to update quantity')
    }
  }

  const clearCart = async () => {
    try {
      await clearCartApi()
      setItems([])
    } catch (error) {
      console.error('Clear cart error:', error)
      toast.error('Unable to clear cart')
    }
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const mrpTotal = items.reduce(
      (sum, item) => sum + (item.mrp || item.price) * item.quantity,
      0
    )

    const savings = mrpTotal - subtotal

    const itemCount = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )

    const shipping =
      subtotal === 0 || subtotal >= 999 ? 0 : 79

    const total = subtotal + shipping

    return {
      subtotal,
      mrpTotal,
      savings,
      itemCount,
      shipping,
      total,
    }
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)

  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }

  return ctx
}