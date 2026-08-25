import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  HiOutlinePaperAirplane,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineDevicePhoneMobile
} from 'react-icons/hi2'
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa'
import { categories } from '../../data/categories'

const perks = [
  { icon: HiOutlineTruck, title: 'Free shipping', desc: 'On orders above ₹999' },
  { icon: HiOutlineArrowPath, title: '7-day returns', desc: 'No questions asked' },
  { icon: HiOutlineShieldCheck, title: 'Secure payments', desc: '100% protected checkout' },
  { icon: HiOutlineDevicePhoneMobile, title: '24/7 support', desc: "We're here to help" },
]

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault()
    const email = e.target.elements.email.value
    if (!email) return
    toast.success('Subscribed! Watch your inbox for deals.')
    e.target.reset()
  }

  return (
    <footer className="bg-primary-950 text-ink-100 mt-20">
      {/* Perks strip */}
      <div className="border-b border-white/10">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3">
              <div className="shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-accent-400">
                <perk.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{perk.title}</p>
                <p className="text-xs text-ink-300">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Brand + newsletter */}
        <div className="col-span-2 lg:col-span-2">
          <span className="font-display text-2xl font-extrabold text-white">Cartly</span>
          <p className="mt-3 text-sm text-ink-300 max-w-xs">
            Everything you need, delivered fast — electronics, fashion, home goods and more, at prices that make sense.
          </p>
          <form onSubmit={handleSubscribe} className="mt-5 flex max-w-sm">
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 rounded-l-xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="rounded-r-xl bg-accent-500 px-4 text-white hover:bg-accent-600 transition-colors"
            >
              <HiOutlinePaperAirplane size={18} />
            </button>
          </form>
          <div className="mt-6 flex gap-3">
            {[FaInstagram, FaFacebookF, FaTwitter, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-500 transition-colors"
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-ink-300">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.id}`} className="hover:text-white transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Help</h4>
          <ul className="space-y-2.5 text-sm text-ink-300">
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Track order</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Returns & refunds</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-ink-300">
            <li><Link to="/about" className="hover:text-white transition-colors">About Cartly</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Privacy policy</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Terms of use</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-300">
          <p>© {new Date().getFullYear()} Cartly. All rights reserved.</p>
          <p>Made with care for shoppers everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
