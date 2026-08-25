import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineMagnifyingGlassMinus,
} from 'react-icons/hi2'

import ProductFilters from '../components/products/ProductFilters.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'

import { getProducts } from '../api/productsApi'
import { fetchCategories } from '../api/categoriesApi'

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Rating' },
]

const PAGE_SIZE = 12

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const dealOnly = searchParams.get('deal') === 'true'
  const initialCategory = searchParams.get('category')

  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: null,
    rating: null,
  })

  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadCatalog() {
      try {
        setCatalogLoading(true)

        const [productResponse, categoryList] = await Promise.all([
          getProducts({ limit: 100 }),
          fetchCategories(),
        ])

        if (cancelled) return

        setAllProducts(productResponse.products || [])
        setCategories(categoryList || [])
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load catalog:', error)
          setAllProducts([])
          setCategories([])
        }
      } finally {
        if (!cancelled) {
          setCatalogLoading(false)
        }
      }
    }

    loadCatalog()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    let list = [...allProducts]

    if (q) {
      const term = q.toLowerCase()

      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      )
    }

    if (dealOnly) {
      list = list.filter((p) => p.tags?.includes('deal'))
    }

    if (filters.categories.length) {
      list = list.filter((p) =>
        filters.categories.includes(p.category)
      )
    }

    if (filters.priceRange) {
      list = list.filter(
        (p) =>
          p.price >= filters.priceRange.min &&
          p.price <= filters.priceRange.max
      )
    }

    if (filters.rating) {
      list = list.filter((p) => p.rating >= filters.rating)
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break

      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break

      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break

      default:
        break
    }

    return list
  }, [allProducts, q, dealOnly, filters, sort])

  const loading = catalogLoading

  const pageProducts = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const activeCategoryName = categories.find(
    (c) => c.id === filters.categories[0]
  )?.name

  const handleFiltersChange = (next) => {
    setFilters(next)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: null,
      rating: null,
    })

    setPage(1)

    const next = new URLSearchParams(searchParams)
    next.delete('category')
    setSearchParams(next)
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">
          {q
            ? `Results for "${q}"`
            : activeCategoryName || 'All products'}
        </h1>

        <p className="text-sm text-ink-500 mt-1">
          {filtered.length} products found
        </p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl bg-white border border-ink-100 p-5 shadow-card">
            <ProductFilters
              filters={filters}
              onChange={handleFiltersChange}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between gap-3 mb-5">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-xl border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700"
            >
              <HiOutlineAdjustmentsHorizontal />
              Filters
            </button>

            <div className="ml-auto flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm text-ink-500 hidden sm:inline"
              >
                Sort by
              </label>

              <select
                id="sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value)
                  setPage(1)
                }}
                className="rounded-xl border border-ink-300 bg-white px-3 py-2 text-sm text-ink-800 focus:outline-none focus:border-primary-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : pageProducts.length === 0 ? (
            <EmptyState
              icon={HiOutlineMagnifyingGlassMinus}
              title="No products match your filters"
              description="Try adjusting or clearing your filters to see more results."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {pageProducts.map((product) => (
                <ProductCard
                  key={product.legacyId || product._id}
                  product={{
                    ...product,
                    id: product.legacyId,
                    mrp: product.originalPrice,
                    ratingCount: product.reviewCount,
                  }}
                />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-ink-600 px-2">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filters"
        maxWidth="max-w-sm"
      >
        <ProductFilters
          filters={filters}
          onChange={handleFiltersChange}
          onClear={clearFilters}
        />

        <Button
          fullWidth
          className="mt-6"
          onClick={() => setMobileFiltersOpen(false)}
        >
          Show {filtered.length} results
        </Button>
      </Modal>
    </div>
  )
}