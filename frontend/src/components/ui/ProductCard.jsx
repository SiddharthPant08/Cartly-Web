import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHeart, HiOutlineHeart, HiOutlineShoppingCart } from 'react-icons/hi2'
import Rating from './Rating.jsx'
import Badge from './Badge.jsx'
import { formatPrice, discountPercent } from '../../utils/format'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const discount = discountPercent(product.price, product.mrp)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex h-full flex-col rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden"
    >
      <button
        onClick={(e) => {
          e.preventDefault()
          toggleWishlist(product)
        }}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-card text-ink-700 hover:text-accent-500 transition-colors"
      >
        {wishlisted ? <HiHeart className="text-accent-500" /> : <HiOutlineHeart />}
      </button>

      {discount > 0 && (
        <Badge tone="accent" className="absolute left-3 top-3 z-10">
          {discount}% OFF
        </Badge>
      )}

      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-ink-100 aspect-square">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-ink-500">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-ink-900 hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2">
          <Rating value={product.rating} count={product.ratingCount} />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink-900">{formatPrice(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-ink-500 line-through">{formatPrice(product.mrp)}</span>
          )}
        </div>

        <div className="mt-3 relative h-9 overflow-hidden">
          <motion.button
            initial={false}
            onClick={() => addToCart(product, 1)}
            className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-xl bg-primary-50 text-primary-700 text-sm font-semibold transition-colors group-hover:bg-primary-600 group-hover:text-white"
          >
            <HiOutlineShoppingCart size={16} />
            Add to cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
