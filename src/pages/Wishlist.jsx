import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiOutlineShoppingCart, HiOutlineTrash } from 'react-icons/hi2'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getProductById } from '../data/products'
import EmptyState from '../components/ui/EmptyState.jsx'
import { formatPrice, discountPercent } from '../utils/format'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={HiOutlineHeart}
          title="Your wishlist is empty"
          description="Save items you love here so you never lose track of them."
          actionLabel="Discover products"
          actionTo="/products"
        />
      </div>
    )
  }

  const handleMoveToCart = (item) => {
    const fullProduct = getProductById(item.id)
    addToCart(fullProduct || item, 1)
    removeFromWishlist(item.id)
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">My wishlist ({items.length})</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const discount = discountPercent(item.price, item.mrp)
          return (
            <div key={item.id} className="flex flex-col rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
              <div className="relative">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  aria-label="Remove from wishlist"
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-card text-ink-600 hover:text-red-500"
                >
                  <HiOutlineTrash size={15} />
                </button>
                <Link to={`/product/${item.id}`} className="block aspect-square bg-ink-100">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </Link>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-ink-500">{item.brand}</p>
                <Link to={`/product/${item.id}`} className="text-sm font-medium text-ink-900 hover:text-primary-600 line-clamp-2 mt-0.5">
                  {item.title}
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-ink-900">{formatPrice(item.price)}</span>
                  {discount > 0 && <span className="text-xs text-ink-500 line-through">{formatPrice(item.mrp)}</span>}
                </div>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 text-white text-sm font-semibold py-2 hover:bg-primary-700 transition-colors"
                >
                  <HiOutlineShoppingCart size={16} /> Move to cart
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
