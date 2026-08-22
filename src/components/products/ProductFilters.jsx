import { categories } from '../../data/categories'

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,500', min: 500, max: 1500 },
  { label: '₹1,500 – ₹5,000', min: 1500, max: 5000 },
  { label: '₹5,000 – ₹20,000', min: 5000, max: 20000 },
  { label: 'Above ₹20,000', min: 20000, max: Infinity },
]

const ratingOptions = [4, 3, 2]

export default function ProductFilters({ filters, onChange, onClear }) {
  const toggleCategory = (id) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id]
    onChange({ ...filters, categories: next })
  }

  const setPriceRange = (range) => {
    const active = filters.priceRange?.label === range.label
    onChange({ ...filters, priceRange: active ? null : range })
  }

  const setRating = (r) => {
    onChange({ ...filters, rating: filters.rating === r ? null : r })
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink-900">Filters</h3>
        <button onClick={onClear} className="text-xs font-semibold text-primary-600 hover:text-primary-700">
          Clear all
        </button>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink-800 mb-3">Category</h4>
        <div className="space-y-2.5">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(c.id)}
                onChange={() => toggleCategory(c.id)}
                className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-ink-700 group-hover:text-ink-900">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink-800 mb-3">Price</h4>
        <div className="space-y-2.5">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange?.label === range.label}
                onChange={() => setPriceRange(range)}
                className="h-4 w-4 border-ink-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-ink-700 group-hover:text-ink-900">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink-800 mb-3">Customer rating</h4>
        <div className="space-y-2.5">
          {ratingOptions.map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === r}
                onChange={() => setRating(r)}
                className="h-4 w-4 border-ink-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-ink-700 group-hover:text-ink-900">{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export { priceRanges }
