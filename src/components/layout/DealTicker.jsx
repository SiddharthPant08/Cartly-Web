import { HiOutlineBolt } from 'react-icons/hi2'
import { getProductsByTag } from '../../data/products'
import { discountPercent } from '../../utils/format'

export default function DealTicker() {
  const deals = getProductsByTag('deal')
  if (!deals.length) return null

  // duplicate the list so the marquee loops seamlessly
  const loopDeals = [...deals, ...deals]

  return (
    <div className="bg-primary-950 text-white overflow-hidden">
      <div className="flex whitespace-nowrap py-2">
        <div className="flex animate-marquee items-center gap-10 pr-10 motion-reduce:animate-none motion-reduce:flex-wrap">
          {loopDeals.map((deal, idx) => (
            <div key={`${deal.id}-${idx}`} className="flex items-center gap-2 text-xs sm:text-sm shrink-0">
              <HiOutlineBolt className="text-accent-400 shrink-0" />
              <span className="font-semibold text-accent-400">Today's Drop</span>
              <span className="text-ink-100/90">{deal.title}</span>
              <span className="font-bold text-white">{discountPercent(deal.price, deal.mrp)}% off</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
