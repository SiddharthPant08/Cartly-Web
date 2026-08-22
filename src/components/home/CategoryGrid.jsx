import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../data/categories'

export default function CategoryGrid() {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Shop by category</h2>
          <p className="text-sm text-ink-500 mt-1">Explore our most-loved departments</p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-primary-600 hover:text-primary-700 shrink-0">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.04 }}
          >
            <Link
              to={`/products?category=${cat.id}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-ink-100 p-4 shadow-card hover:shadow-lift hover:-translate-y-1 transition-all duration-200"
            >
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-ink-100 ring-2 ring-transparent group-hover:ring-primary-200 transition-all">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-ink-800 text-center">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
