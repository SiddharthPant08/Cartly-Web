import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineUserCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowRightOnRectangle,
  HiChevronDown,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2'
import { categories } from '../../data/categories.js'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Deals', to: '/products?deal=true' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [query, setQuery] = useState('')
  const accountRef = useRef(null)
  const categoryRef = useRef(null)
  const navigate = useNavigate()

  const { totals } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false)
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-ink-100">
      <div className="container-page">
        <div className="flex items-center gap-4 h-16 sm:h-[72px]">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg text-ink-700 hover:bg-ink-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HiBars3 size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <span className="font-display text-2xl font-extrabold text-primary-600">Cartly</span>
            <span className="hidden sm:inline-block h-2 w-2 rounded-full bg-accent-500 mb-3" />
          </Link>

          {/* Category + Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl items-stretch">
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setCategoryOpen((v) => !v)}
                className="flex h-full items-center gap-1 rounded-l-xl border border-r-0 border-ink-300 bg-ink-100 px-3.5 text-sm font-medium text-ink-700 hover:bg-ink-200 transition-colors"
              >
                All
                <HiChevronDown className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {categoryOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-[calc(100%+8px)] w-56 rounded-xl bg-white shadow-soft border border-ink-100 py-2 z-50 max-h-80 overflow-auto"
                  >
                    {categories.map((c) => (
                      <li key={c.id}>
                        <Link
                          to={`/products?category=${c.id}`}
                          onClick={() => setCategoryOpen(false)}
                          className="block px-4 py-2 text-sm text-ink-700 hover:bg-primary-50 hover:text-primary-700"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for products, brands and more"
              className="flex-1 border h-12 border-ink-300 px-4 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-primary-500"
            />
            <button
              type="submit"
              className="rounded-r-xl bg-primary-600 px-4 text-white hover:bg-primary-700 transition-colors"
              aria-label="Search"
            >
              <HiOutlineMagnifyingGlass size={20} />
            </button>
          </form>

          <div className="flex-1 lg:hidden" />

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              to="/products"
              className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-ink-100"
              aria-label="Search"
            >
              <HiOutlineMagnifyingGlass size={22} />
            </Link>

            {/* Account */}
            <div className="relative hidden sm:block" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 p-2 rounded-lg text-ink-700 hover:bg-ink-100"
              >
                <HiOutlineUser size={22} />
                <span className="hidden xl:inline text-sm font-medium max-w-[90px] truncate">
                  {isAuthenticated ? `Hi, ${user.name.split(' ')[0]}` : 'Account'}
                </span>
                <HiChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl bg-white shadow-soft border border-ink-100 py-2 z-50"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-ink-100 mb-1">
                          <p className="text-sm font-semibold text-ink-900 truncate">{user.name}</p>
                          <p className="text-xs text-ink-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <HiOutlineUserCircle size={18} /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <HiOutlineClipboardDocumentList size={18} /> My Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setAccountOpen(false)
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <HiOutlineArrowRightOnRectangle size={18} /> Logout
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-1">
                        <Link
                          to="/login"
                          onClick={() => setAccountOpen(false)}
                          className="block w-full text-center rounded-lg bg-primary-600 text-white text-sm font-semibold py-2 hover:bg-primary-700 mb-2"
                        >
                          Login
                        </Link>
                        <p className="text-xs text-center text-ink-500">
                          New here?{' '}
                          <Link to="/register" className="text-primary-600 font-medium" onClick={() => setAccountOpen(false)}>
                            Sign up
                          </Link>
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 rounded-lg text-ink-700 hover:bg-ink-100" aria-label="Wishlist">
              <HiOutlineHeart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-1.5 p-2 rounded-lg text-ink-700 hover:bg-ink-100">
              <span className="relative">
                <HiOutlineShoppingCart size={22} />
                {totals.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                    {totals.itemCount}
                  </span>
                )}
              </span>
              <span className="hidden md:inline text-sm font-medium">Cart</span>
            </Link>
          </div>
        </div>

        {/* Secondary nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-7 h-11 border-t border-ink-100 text-sm">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-ink-700 hover:text-primary-600 font-medium transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-900/40 z-[60] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-[82%] max-w-xs bg-white z-[70] lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-ink-100">
                <span className="font-display text-xl font-extrabold text-primary-600">Cartly</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-ink-100" aria-label="Close menu">
                  <HiXMark size={22} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="p-4 border-b border-ink-100">
                <div className="flex items-center rounded-xl border border-ink-300 px-3 py-2">
                  <HiOutlineMagnifyingGlass className="text-ink-500 mr-2" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Cartly"
                    className="flex-1 text-sm focus:outline-none"
                  />
                </div>
              </form>

              <div className="flex-1 overflow-y-auto py-2">
                <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase text-ink-500">Menu</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-ink-800 hover:bg-primary-50"
                  >
                    {link.label}
                  </Link>
                ))}
                <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase text-ink-500">Categories</p>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/products?category=${c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-primary-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-ink-100 p-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="w-full rounded-xl border border-ink-300 py-2.5 text-sm font-semibold text-ink-800"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white"
                  >
                    Login / Sign up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
