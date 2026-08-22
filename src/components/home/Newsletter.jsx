import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { HiOutlineGift } from 'react-icons/hi2'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Code CARTLY200 sent to your inbox!')
    setEmail('')
  }

  return (
    <section className="container-page py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-primary-950 px-6 py-10 sm:px-14 sm:py-14 text-center relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-700/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent-500/30 blur-3xl" />

        <div className="relative">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/20 text-accent-400 mb-4">
            <HiOutlineGift size={24} />
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-balance">Get ₹200 off your first order</h2>
          <p className="mt-2 text-sm text-ink-300 max-w-md mx-auto">
            Sign up for restock alerts and early access to sales — no spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600 transition-colors shrink-0"
            >
              Claim my code
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
