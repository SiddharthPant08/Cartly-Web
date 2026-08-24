import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext.jsx'
import apiClient from '../api/axiosClient'
import Button from '../components/ui/Button.jsx'

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

export default function Admin() {
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

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

  useEffect(() => {
    loadProducts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || form.price),
        discount: Number(form.discount || 0),
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        images: form.images
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
        const response = await apiClient.put(`/products/${editingId}`, payload)

        setProducts((prev) =>
          prev.map((product) =>
            product._id === editingId ? response.data.product : product
          )
        )

        toast.success('Product updated')
      } else {
        const response = await apiClient.post('/products', payload)
        setProducts((prev) => [response.data.product, ...prev])
        toast.success('Product created')
      }

      setForm(emptyForm)
      setEditingId(null)
    } catch (error) {
      console.error('Admin product error:', error)
      toast.error(error.response?.data?.message || 'Unable to save product')
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
      images: product.images?.join(', ') || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      toast.error(error.response?.data?.message || 'Unable to delete product')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold text-ink-900">
          Access denied
        </h1>
        <p className="mt-2 text-ink-500">
          Admin access is required.
        </p>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-ink-500 mt-1">
          Manage your Cartly products
        </p>
      </div>

      {/* Product form */}
      <div className="rounded-2xl bg-white border border-ink-100 shadow-card p-6 mb-8">
        <h2 className="text-lg font-bold text-ink-900 mb-5">
          {editingId ? 'Edit product' : 'Add product'}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            required
            placeholder="Product title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <input
            required
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="md:col-span-2 rounded-xl border border-ink-300 px-4 py-3 text-sm"
            rows={3}
          />

          <input
            required
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <input
            type="number"
            placeholder="Original price"
            value={form.originalPrice}
            onChange={(e) =>
              setForm({ ...form, originalPrice: e.target.value })
            }
            className="rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <input
            type="number"
            placeholder="Discount %"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: e.target.value })
            }
            className="rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <input
            placeholder="Image URLs, separated by commas"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            className="md:col-span-2 rounded-xl border border-ink-300 px-4 py-3 text-sm"
          />

          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
            </Button>

            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Products */}
      <div className="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
        <div className="p-5 border-b border-ink-100">
          <h2 className="font-bold text-ink-900">
            Products ({products.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-ink-500">
            Loading products...
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-4 flex items-center gap-4"
              >
                <img
                  src={product.images?.[0]}
                  alt=""
                  className="h-16 w-16 rounded-xl object-cover bg-ink-50"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-ink-500">
                    {product.brand} · Stock: {product.stock}
                  </p>
                  <p className="font-bold text-ink-900 mt-1">
                    ₹{product.price}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editProduct(product)}
                  >
                    <HiOutlinePencil size={15} />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProduct(product._id)}
                  >
                    <HiOutlineTrash size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}