import { createContext, useContext, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('cartly:cart', [])

  const addToCart = (product, quantity = 1, variant = {}) => {
    setItems((prev) => {
      const lineId = `${product.id}-${variant.color || 'default'}-${variant.size || 'default'}`
      const existing = prev.find((i) => i.lineId === lineId)
      if (existing) {
        return prev.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [
        ...prev,
        {
          lineId,
          id: product.id,
          title: product.title,
          image: product.images?.[0],
          price: product.price,
          mrp: product.mrp,
          brand: product.brand,
          stock: product.stock,
          quantity,
          ...variant,
        },
      ]
    })
    toast.success(`${product.title.length > 28 ? product.title.slice(0, 28) + '…' : product.title} added to cart`)
  }

  const removeFromCart = (lineId, opts = {}) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId))
    if (!opts.silent) toast('Removed from cart', { icon: '🗑️' })
  }

  const updateQuantity = (lineId, quantity) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const mrpTotal = items.reduce((sum, i) => sum + (i.mrp || i.price) * i.quantity, 0)
    const savings = mrpTotal - subtotal
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
    const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79
    const total = subtotal + shipping
    return { subtotal, mrpTotal, savings, itemCount, shipping, total }
  }, [items])

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
