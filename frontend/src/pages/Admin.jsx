import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCurrencyRupee,
  HiOutlineArrowPath,
  HiOutlineSquares2X2,
  HiOutlineShieldExclamation,
  HiOutlinePlusCircle,
} from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext.jsx'
import apiClient from '../api/axiosClient'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

const emptyForm = {
  title: '',
  description: '',
  price: '',
  originalPrice: '',
  discount: '',
  category: 'electronics',
  brand: '',
  stock: '',
  images: '',
}

const orderStatuses = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const statusDot = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
}

// Hex equivalents of the dots above, used for the order card's left accent
// border (Tailwind can't purge dynamically-built color classes reliably,
// so this one mapping uses inline style values instead). Presentational only.
const statusHex = {
  pending: '#eab308',
  processing: '#3b82f6',
  shipped: '#a855f7',
  delivered: '#10b981',
  cancelled: '#ef4444',
}

// Presentational-only helper — colors a product row by stock health.
// Does not affect any data or handler logic.
const stockAccent = (stock) => {
  if (stock === 0) return { bar: 'bg-red-500', chip: 'bg-red-50 text-red-600' }
  if (stock < 10) return { bar: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700' }
  return { bar: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700' }
}

const fieldClass =
  'w-full rounded-xl border border-ink-300 px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-shadow'

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function Admin() {
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  })

  // Presentational only — which panel is visible. Both panels still load
  // their data on mount regardless of which tab is active.
  const [activeTab, setActiveTab] = useState('products')

  const loadProducts = async () => {
    try {
      const response = await apiClient.get('/products?limit=50')
      setProducts(response.data.products || [])
    } catch (error) {
      console.error(error)
      toast.error('Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/orders/admin/stats')
      setStats(response.data.stats)
    } catch (error) {
      console.error('Load stats error:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await apiClient.get('/orders/admin/all')
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Load admin orders error:', error)
      toast.error(
        error.response?.data?.message || 'Unable to load orders'
      )
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    loadOrders()
    loadStats()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const imageValue = form.images.trim()

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || form.price),
        discount: Number(form.discount || 0),
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        images: imageValue.startsWith('data:image/')
          ? [imageValue]
          : imageValue
              .split(',')
              .map((url) => url.trim())
              .filter(Boolean),
        tags: [],
        specifications: {},
        rating: 0,
        reviewCount: 0,
        isFeatured: false,
        isDeal: false,
        isActive: true,
        highlights: [],
        colors: [],
        sizes: [],
        legacyId: editingId ? undefined : `admin-${Date.now()}`,
      }

      if (editingId) {
        const response = await apiClient.put(
          `/products/${editingId}`,
          payload
        )

        setProducts((prev) =>
          prev.map((product) =>
            product._id === editingId
              ? response.data.product
              : product
          )
        )

        toast.success('Product updated')
      } else {
        const response = await apiClient.post('/products', payload)

        setProducts((prev) => [
          response.data.product,
          ...prev,
        ])

        toast.success('Product created')
      }

      setForm(emptyForm)
      setEditingId(null)
    } catch (error) {
      console.error('Admin product error:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to save product'
      )
    } finally {
      setSaving(false)
    }
  }

  const editProduct = (product) => {
    setEditingId(product._id)

    setForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || '',
      category: product.category || 'electronics',
      brand: product.brand || '',
      stock: product.stock || '',
      images: product.images?.[0] || '',
    })

    setActiveTab('products')
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return

    try {
      await apiClient.delete(`/products/${id}`)

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      )

      toast.success('Product deleted')
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
          'Unable to delete product'
      )
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await apiClient.put(
        `/orders/admin/${orderId}/status`,
        { status }
      )

      const updatedOrder = response.data.order

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      )

      toast.success('Order status updated')
    } catch (error) {
      console.error('Update order status error:', error)

      toast.error(
        error.response?.data?.message ||
          'Unable to update order status'
      )
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  const statusClass = (status) => {
    const classes = {
      pending:
        'bg-yellow-50 text-yellow-700 border-yellow-200',
      processing:
        'bg-blue-50 text-blue-700 border-blue-200',
      shipped:
        'bg-purple-50 text-purple-700 border-purple-200',
      delivered:
        'bg-green-50 text-green-700 border-green-200',
      cancelled:
        'bg-red-50 text-red-700 border-red-200',
    }

    return (
      classes[status] ||
      'bg-ink-50 text-ink-700 border-ink-200'
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container-page py-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm w-full rounded-2xl bg-white border border-ink-100 shadow-card p-8 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
            <HiOutlineShieldExclamation size={30} />
          </div>
          <h1 className="text-xl font-bold text-ink-900">Access denied</h1>
          <p className="mt-2 text-sm text-ink-500">
            You need an admin account to view this dashboard.
          </p>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total orders',
      value: stats.totalOrders,
      icon: HiOutlineClipboardDocumentList,
      gradient: 'from-blue-500 to-indigo-600',
      glow: 'shadow-[0_10px_30px_-8px_rgba(79,70,229,0.55)]',
    },
    {
      label: 'Pending',
      value: stats.pendingOrders,
      icon: HiOutlineClock,
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-[0_10px_30px_-8px_rgba(249,115,22,0.5)]',
    },
    {
      label: 'Delivered',
      value: stats.deliveredOrders,
      icon: HiOutlineCheckCircle,
      gradient: 'from-emerald-400 to-teal-500',
      glow: 'shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)]',
    },
    {
      label: 'Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: HiOutlineCurrencyRupee,
      gradient: 'from-violet-500 to-fuchsia-600',
      glow: 'shadow-[0_10px_30px_-8px_rgba(217,70,239,0.5)]',
    },
  ]

  const tabs = [
    { id: 'products', label: 'Products', icon: HiOutlineCube, count: products.length },
    { id: 'orders', label: 'Orders', icon: HiOutlineSquares2X2, count: orders.length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/60 via-canvas to-orange-50/40">
      {/* Header banner */}
      <div className="bg-gradient-to-br from-primary-950 via-primary-800 to-purple-900 relative overflow-hidden">
        <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="container-page relative py-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-white/70 mt-1">Manage your Cartly products and orders</p>
            </div>
            {user?.name && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-sm text-white border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
                {user.name}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container-page py-8 -mt-6">
        {/* Stats */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 text-white ${stat.glow}`}
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
              <div className="absolute -right-8 bottom-0 h-16 w-16 rounded-full bg-white/10" />
              <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur mb-3">
                <stat.icon size={20} />
              </div>
              <p className="relative text-sm text-white/80">{stat.label}</p>
              <p className="relative text-2xl font-bold mt-0.5">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 rounded-2xl bg-white border border-ink-100 shadow-card p-1.5 w-fit">
          {tabs.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-white' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-tab-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 shadow-lift"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <tab.icon size={16} />
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                      active ? 'bg-white/20' : 'bg-ink-100 text-ink-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'products' ? (
            <motion.div
              key="products-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* ================= PRODUCT FORM ================= */}
              <div className="relative rounded-2xl bg-white border border-ink-100 shadow-card p-6 mb-8 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500" />
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-ink-900 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-card">
                      <HiOutlinePlusCircle size={18} />
                    </span>
                    {editingId ? 'Edit product' : 'Add product'}
                  </h2>
                  <AnimatePresence>
                    {editingId && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-xs font-semibold text-white bg-gradient-to-r from-accent-500 to-orange-600 rounded-full px-3 py-1 shadow-card"
                      >
                        Editing existing product
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Title</label>
                    <input
                      required
                      placeholder="Product title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Brand</label>
                    <input
                      required
                      placeholder="Brand"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Description</label>
                    <textarea
                      required
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`${fieldClass} resize-none`}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Price</label>
                    <input
                      required
                      type="number"
                      placeholder="Price"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Original price</label>
                    <input
                      type="number"
                      placeholder="Original price"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Discount %</label>
                    <input
                      type="number"
                      placeholder="Discount %"
                      value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Stock</label>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Category</label>
                    <input
                      placeholder="Category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-ink-500 mb-1.5 block">Image URL(s)</label>
                    <input
                      placeholder="Image URL or data:image..."
                      value={form.images}
                      onChange={(e) => setForm({ ...form, images: e.target.value })}
                      className={fieldClass}
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-3 pt-1">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-[0_10px_25px_-8px_rgba(124,58,237,0.5)]"
                    >
                      {saving ? (
                        <>
                          <HiOutlineArrowPath className="animate-spin" size={16} />
                          Saving...
                        </>
                      ) : editingId ? (
                        'Update product'
                      ) : (
                        'Add product'
                      )}
                    </Button>

                    {editingId && (
                      <Button type="button" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* ================= PRODUCTS LIST ================= */}
              <div className="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
                <div className="p-5 border-b border-ink-100">
                  <h2 className="font-bold text-ink-900">Products ({products.length})</h2>
                </div>

                {loading ? (
                  <div className="p-5 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 animate-pulse">
                        <div className="h-16 w-16 rounded-xl bg-ink-100 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 w-1/3 rounded bg-ink-100" />
                          <div className="h-3 w-1/4 rounded bg-ink-100" />
                          <div className="h-3.5 w-16 rounded bg-ink-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <EmptyState
                    icon={HiOutlineCube}
                    title="No products yet"
                    description="Add your first product using the form above to see it listed here."
                  />
                ) : (
                  <motion.div variants={listVariants} initial="hidden" animate="show" className="divide-y divide-ink-100">
                    <AnimatePresence initial={false}>
                      {products.map((product) => {
                        const accent = stockAccent(product.stock)
                        return (
                          <motion.div
                            key={product._id}
                            variants={itemVariants}
                            exit={{ opacity: 0, x: -12, transition: { duration: 0.2 } }}
                            layout
                            className="relative p-4 pl-6 flex items-center gap-4 hover:bg-ink-50/60 transition-colors"
                          >
                            <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${accent.bar}`} />
                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-ink-50 shrink-0 ring-2 ring-white shadow-card">
                              <img
                                src={product.images?.[0]}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-ink-900 truncate">{product.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-ink-500">{product.brand}</p>
                                <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${accent.chip}`}>
                                  {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                                </span>
                              </div>
                              <p className="font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mt-1">
                                ₹{product.price}
                              </p>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => editProduct(product)}
                                aria-label="Edit product"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 text-ink-600 hover:border-transparent hover:bg-gradient-to-br hover:from-primary-500 hover:to-purple-600 hover:text-white transition-all"
                              >
                                <HiOutlinePencil size={15} />
                              </button>
                              <button
                                onClick={() => deleteProduct(product._id)}
                                aria-label="Delete product"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 text-ink-600 hover:border-transparent hover:bg-gradient-to-br hover:from-red-500 hover:to-rose-600 hover:text-white transition-all"
                              >
                                <HiOutlineTrash size={15} />
                              </button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="orders-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* ================= ORDERS ================= */}
              <div className="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
                <div className="p-5 border-b border-ink-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-ink-900">Orders ({orders.length})</h2>
                    <p className="text-xs text-ink-500 mt-1">Manage customer orders and delivery status</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOrdersLoading(true)
                      loadOrders()
                    }}
                    className="border-primary-200 text-primary-700 hover:bg-gradient-to-r hover:from-primary-500 hover:to-purple-600 hover:text-white hover:border-transparent"
                  >
                    <HiOutlineArrowPath className={ordersLoading ? 'animate-spin' : ''} size={15} />
                    Refresh
                  </Button>
                </div>

                {ordersLoading ? (
                  <div className="p-5 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse space-y-3">
                        <div className="h-4 w-1/3 rounded bg-ink-100" />
                        <div className="h-3 w-1/2 rounded bg-ink-100" />
                        <div className="h-10 w-full rounded-xl bg-ink-100" />
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon={HiOutlineClipboardDocumentList}
                    title="No orders found"
                    description="Once customers start checking out, their orders will show up here."
                  />
                ) : (
                  <motion.div variants={listVariants} initial="hidden" animate="show" className="divide-y divide-ink-100">
                    {orders.map((order) => (
                      <motion.div
                        key={order._id}
                        variants={itemVariants}
                        className="p-5 border-l-4 hover:bg-ink-50/40 transition-colors"
                        style={{ borderLeftColor: statusHex[order.status] || '#e2e8f0' }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                          {/* Order info */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${statusDot[order.status] || 'bg-ink-300'}`} />
                              <p className="font-bold text-ink-900">Order #{order._id.slice(-8)}</p>
                              <span className="text-xs text-ink-400">{formatDate(order.createdAt)}</span>
                            </div>

                            <div className="mt-2 text-sm text-ink-600">
                              <p>
                                Customer:{' '}
                                <span className="font-semibold text-ink-900">
                                  {order.user?.name || order.shippingAddress?.fullName || 'Customer'}
                                </span>
                              </p>

                              {order.user?.email && (
                                <p className="text-xs text-ink-500 mt-0.5">{order.user.email}</p>
                              )}

                              <p className="mt-1">
                                Payment:{' '}
                                <span className="font-medium">
                                  {String(order.paymentMethod || '').toUpperCase()}
                                </span>
                              </p>
                            </div>

                            {/* Items */}
                            <div className="mt-4 space-y-2">
                              {order.items?.map((item, index) => (
                                <div
                                  key={item.product?._id || `${order._id}-${index}`}
                                  className="flex items-center gap-3"
                                >
                                  <img
                                    src={item.image || item.product?.images?.[0]}
                                    alt=""
                                    className="h-10 w-10 rounded-lg object-cover bg-ink-50"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-ink-900 truncate">
                                      {item.title || item.product?.title}
                                    </p>
                                    <p className="text-xs text-ink-500">
                                      Qty: {item.quantity} · ₹{item.price}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right side */}
                          <div className="lg:w-56 flex flex-col gap-3">
                            <div>
                              <p className="text-xs text-ink-500">Order total</p>
                              <p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                ₹{order.total}
                              </p>
                            </div>

                            <div>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                                  order.status
                                )}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[order.status] || 'bg-ink-400'}`} />
                                {order.status}
                              </span>
                            </div>

                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="w-full rounded-xl border border-ink-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-shadow"
                            >
                              {orderStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}