import { HiOutlineHeart, HiOutlineGlobeAlt, HiOutlineSparkles } from 'react-icons/hi2'

const values = [
  { icon: HiOutlineHeart, title: 'Customer first', desc: 'Every decision starts with what makes shopping easier for you.' },
  { icon: HiOutlineGlobeAlt, title: 'Nationwide reach', desc: 'Serving shoppers across every state with fast, reliable delivery.' },
  { icon: HiOutlineSparkles, title: 'Quality checked', desc: 'Every listing is vetted so you always know what you\'re getting.' },
]

export default function About() {
  return (
    <div className="container-page py-14 max-w-4xl">
      <h1 className="text-3xl font-bold text-ink-900">About Cartly</h1>
      <p className="mt-4 text-ink-600 leading-relaxed">
        Cartly started with a simple idea: online shopping should feel effortless. From electronics to everyday
        essentials, we curate a catalog that balances quality, price, and convenience — backed by fast delivery and a
        support team that actually helps.
      </p>
      <p className="mt-4 text-ink-600 leading-relaxed">
        Today, Cartly serves shoppers across the country, working with trusted brands and sellers to bring
        dependable products to your doorstep, every time.
      </p>

      <div className="mt-10 grid sm:grid-cols-3 gap-5">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl bg-white border border-ink-100 shadow-card p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
              <v.icon size={20} />
            </div>
            <h3 className="font-semibold text-ink-900">{v.title}</h3>
            <p className="mt-1.5 text-sm text-ink-500">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
