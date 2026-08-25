import { useEffect, useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { HiHeart, HiOutlineHeart, HiOutlineShoppingCart, HiOutlineTruck, HiOutlineArrowPath, HiOutlineShieldCheck } from 'react-icons/hi2'
import Rating from '../components/ui/Rating.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import QuantityStepper from '../components/ui/QuantityStepper.jsx'
import ProductCarousel from '../components/home/ProductCarousel.jsx'
import { fetchProductById, fetchRelatedProducts } from '../api/productsApi'
import { formatPrice, discountPercent } from '../utils/format'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

const dummyReviews = [
  { id: 1, name: 'Ananya S.', rating: 5, comment: 'Exceeded expectations, great build quality and fast delivery.' },
  { id: 2, name: 'Rahul K.', rating: 4, comment: 'Good value for money. Works exactly as described.' },
  { id: 3, name: 'Meera P.', rating: 5, comment: 'My second purchase from this brand — consistently reliable.' },
]

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])

  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setActiveImage(0)
      setColor(null)
      setSize(null)
      setQuantity(1)
      const found = await fetchProductById(id)
      if (cancelled) return
      setProduct(found || null)
      setLoading(false)
      if (found) {
        const related = await fetchRelatedProducts(found)
        if (!cancelled) setRelatedProducts(related)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="container-page py-10 grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square rounded-2xl bg-ink-100" />
        <div className="space-y-4">
          <div className="h-4 w-1/3 rounded bg-ink-100" />
          <div className="h-7 w-3/4 rounded bg-ink-100" />
          <div className="h-5 w-1/4 rounded bg-ink-100" />
          <div className="h-9 w-1/2 rounded bg-ink-100" />
          <div className="h-24 w-full rounded bg-ink-100" />
        </div>
      </div>
    )
  }

  if (!product) return <Navigate to="/404" replace />

  const discount = discountPercent(product.price, product.mrp)
  const wishlisted = isWishlisted(product.id)
  const variant = { ...(color && { color }), ...(size && { size }) }

  const handleAddToCart = () => addToCart(product, quantity, variant)
  const handleBuyNow = () => {
    addToCart(product, quantity, variant)
    navigate('/checkout')
  }

  return (
    <div className="container-page py-8">
      <nav className="text-xs text-ink-500 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-primary-600 capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <span>/</span>
        <span className="text-ink-800 line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-ink-100 border border-ink-100">
            <img src={product.images[activeImage]} alt={product.title} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === idx ? 'border-primary-600' : 'border-ink-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium text-primary-600">{product.brand}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-ink-900 text-balance">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} count={product.ratingCount} />
            {product.tags?.includes('bestseller') && <Badge tone="primary">Bestseller</Badge>}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-ink-900">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-ink-500 line-through text-sm">{formatPrice(product.mrp)}</span>
                <Badge tone="accent">{discount}% off</Badge>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-500">Inclusive of all taxes</p>

          {product.colors && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-ink-800 mb-2">Color: <span className="font-normal text-ink-600">{color || 'Select an option'}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-xl border px-3.5 py-2 text-sm transition-colors ${
                      color === c ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-ink-300 text-ink-700 hover:border-primary-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-ink-800 mb-2">Size: <span className="font-normal text-ink-600">{size || 'Select an option'}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-xl border px-3.5 py-2 text-sm transition-colors ${
                      size === s ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-ink-300 text-ink-700 hover:border-primary-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <p className="text-sm font-semibold text-ink-800">Quantity</p>
            <QuantityStepper value={quantity} onChange={setQuantity} max={Math.min(10, product.stock)} />
            <span className="text-xs text-ink-500">{product.stock} in stock</span>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Button size="lg" fullWidth onClick={handleAddToCart} className="sm:flex-1">
              <HiOutlineShoppingCart size={18} /> Add to cart
            </Button>
            <Button size="lg" variant="accent" fullWidth onClick={handleBuyNow} className="sm:flex-1">
              Buy now
            </Button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                wishlisted ? 'border-accent-500 text-accent-500 bg-accent-50' : 'border-ink-300 text-ink-600 hover:border-accent-400'
              }`}
            >
              {wishlisted ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
            </button>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl bg-white border border-ink-100 p-4">
            {[
              { icon: HiOutlineTruck, label: 'Free delivery' },
              { icon: HiOutlineArrowPath, label: '7-day returns' },
              { icon: HiOutlineShieldCheck, label: 'Secure payment' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 text-center">
                <f.icon className="text-primary-600" size={20} />
                <span className="text-[11px] text-ink-600">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-6 border-b border-ink-200">
          {[
            { id: 'description', label: 'Description' },
            { id: 'highlights', label: 'Highlights' },
            { id: 'reviews', label: `Reviews (${product.ratingCount})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-500 hover:text-ink-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-6 max-w-3xl">
          {tab === 'description' && <p className="text-sm text-ink-700 leading-relaxed">{product.description}</p>}
          {tab === 'highlights' && (
            <ul className="space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          {tab === 'reviews' && (
            <div className="space-y-5">
              {dummyReviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-ink-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink-900">{r.name}</p>
                    <Rating value={r.rating} showCount={false} />
                  </div>
                  <p className="mt-2 text-sm text-ink-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductCarousel title="You may also like" products={relatedProducts} viewAllTo={`/products?category=${product.category}`} />
    </div>
  )
}
