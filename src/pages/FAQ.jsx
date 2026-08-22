import { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi2'

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders arrive within 3-5 business days. Metro cities often see delivery in 1-2 days, and exact estimates are shown at checkout before you pay.',
  },
  {
    q: 'What is your return policy?',
    a: 'You can return most items within 7 days of delivery for a full refund, as long as they\'re unused and in original packaging. Head to My Orders to start a return.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'We accept all major credit/debit cards, UPI, and Cash on Delivery on eligible orders.',
  },
  {
    q: 'How do I track my order?',
    a: 'Go to My Orders from your account menu to see real-time status for every order you\'ve placed.',
  },
  {
    q: 'Can I change or cancel an order after placing it?',
    a: 'Orders can be cancelled from My Orders as long as they haven\'t shipped yet. Once shipped, you\'ll need to use our return process instead.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <div className="container-page py-14 max-w-2xl">
      <h1 className="text-3xl font-bold text-ink-900 mb-2">Frequently asked questions</h1>
      <p className="text-ink-500 mb-8">Can't find what you're looking for? Reach out on our Contact page.</p>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = open === idx
          return (
            <div key={faq.q} className="rounded-2xl bg-white border border-ink-100 shadow-card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
              >
                <span className="text-sm sm:text-base font-semibold text-ink-900">{faq.q}</span>
                <HiChevronDown className={`shrink-0 text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <p className="text-sm text-ink-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
