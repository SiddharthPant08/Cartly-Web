import { motion } from 'framer-motion'

const stats = [
  { value: '1.2M+', label: 'Happy customers' },
  { value: '4.6★', label: 'Average rating' },
  { value: '15,000+', label: 'Products listed' },
  { value: '24 hrs', label: 'Avg. dispatch time' },
]

export default function TrustStrip() {
  return (
    <section className="container-page py-8 sm:py-10">
      <div className="rounded-3xl bg-white border border-ink-100 shadow-card grid grid-cols-2 sm:grid-cols-4 divide-x divide-ink-100">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="flex flex-col items-center justify-center gap-1 py-6 px-2 text-center"
          >
            <span className="text-2xl sm:text-3xl font-extrabold text-primary-600">{stat.value}</span>
            <span className="text-xs sm:text-sm text-ink-500">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
