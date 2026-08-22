import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-14 flex justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white border border-ink-100 shadow-card p-8">
        <h1 className="text-2xl font-bold text-ink-900 text-center">Welcome back</h1>
        <p className="mt-1.5 text-sm text-ink-500 text-center">Log in to continue shopping on Cartly</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium text-ink-800 mb-1.5 block">Email address</label>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:border-primary-500 ${
                  errors.email ? 'border-red-400' : 'border-ink-300'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-ink-800 mb-1.5 block">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-primary-500 ${
                  errors.password ? 'border-red-400' : 'border-ink-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              >
                {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          New to Cartly?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
