import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2'
import Button from '../components/ui/Button.jsx'

const info = [
  { icon: HiOutlineMapPin, text: '4th Floor, Prestige Tech Park, Bengaluru, KA 560103' },
  { icon: HiOutlinePhone, text: '+91 80 4567 8900' },
  { icon: HiOutlineEnvelope, text: 'support@cartly.example' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success("Message sent — we'll get back to you soon!")
      setForm({ name: '', email: '', message: '' })
      setSubmitting(false)
    }, 700)
  }

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold text-ink-900">Get in touch</h1>
      <p className="mt-2 text-ink-500 max-w-lg">Questions about an order or just want to say hi? We'd love to hear from you.</p>

      <div className="mt-10 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-5">
          {info.map((i) => (
            <div key={i.text} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <i.icon size={18} />
              </div>
              <p className="text-sm text-ink-700 pt-2">{i.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-ink-100 shadow-card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-800 mb-1.5 block">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-800 mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-800 mb-1.5 block">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send message'}</Button>
        </form>
      </div>
    </div>
  )
}
