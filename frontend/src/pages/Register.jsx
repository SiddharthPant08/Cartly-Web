import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key, label, icon, type = 'text', placeholder = '') => {
    const Icon = icon
    return (
      <div>
        <label className="text-sm font-medium text-ink-800 mb-1.5 block">{label}</label>
        <div className="relative">
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
          <input
            type={type}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:border-primary-500 ${
              errors[key] ? 'border-red-400' : 'border-ink-300'
            }`}
          />
        </div>
        {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
      </div>
    )
  }

  return (
    <div className="container-page py-14 flex justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white border border-ink-100 shadow-card p-8">
        <h1 className="text-2xl font-bold text-ink-900 text-center">Create your account</h1>
        <p className="mt-1.5 text-sm text-ink-500 text-center">Join Cartly for faster checkout & order tracking</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          {field('name', 'Full name', HiOutlineUser, 'text', 'Jordan Lee')}
          {field('email', 'Email address', HiOutlineEnvelope, 'email', 'you@example.com')}
          {field('password', 'Password', HiOutlineLockClosed, 'password', '••••••••')}
          {field('confirm', 'Confirm password', HiOutlineLockClosed, 'password', '••••••••')}

          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
