import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineBolt } from 'react-icons/hi2'
import { formatPrice, discountPercent } from '../../utils/format'
import { useCart } from '../../context/CartContext.jsx'

function getMidnight() {
  const d = new Date()
  d.setHours(24, 0, 0, 0)
  return d
}

function useCountdown() {
  const [remaining, setRemaining] = useState(getMidnight() - new Date())

  useEffect(() => {
    const id = setInterval(() => setRemaining(getMidnight() - new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hrs = Math.max(0, Math.floor(remaining / 3600000))
  const mins = Math.max(0, Math.floor((remaining % 3600000) / 60000))
  const secs = Math.max(0, Math.floor((remaining % 60000) / 1000))
  return { hrs, mins, secs }
}

export default function DealOfTheDay({ product }) {
  const { hrs, mins, secs } = useCountdown()
  const { addToCart } = useCart()
  if (!product) return null
  const discount = discountPercent(product.price, product.mrp)

  return (
    <section className="container-page py-8 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-gradient-to-r from-accent-500 to-accent-600 overflow-hidden shadow-lift"
      >
        <div className="grid md:grid-cols-2 items-center gap-6 p-6 sm:p-10">
          <div className="text-white order-2 md:order-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <HiOutlineBolt /> Deal of the day
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-balance">{product.title}</h2>
            <p className="mt-2 text-white/85 text-sm max-w-md">{product.description}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold">{formatPrice(product.price)}</span>
              <span className="text-white/70 line-through text-sm">{formatPrice(product.mrp)}</span>
              <span className="rounded-full bg-white text-accent-700 text-xs font-bold px-2.5 py-1">{discount}% OFF</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {[
                { label: 'Hrs', value: hrs },
                { label: 'Min', value: mins },
                { label: 'Sec', value: secs },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center rounded-xl bg-white/15 px-3.5 py-2 min-w-[56px]">
                  <span className="text-lg font-bold tabular-nums">{String(t.value).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase text-white/70">{t.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => addToCart(product, 1)}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-accent-700 hover:bg-white/90 transition-colors"
              >
                Add to cart
              </button>
              <Link
                to={`/product/${product.id}`}
                className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                View details
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="mx-auto max-w-xs rounded-2xl overflow-hidden bg-white/10 aspect-square">
              <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
