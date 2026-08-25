import { HiStar } from 'react-icons/hi2'

export default function Rating({ value = 0, count, size = 13, showCount = true }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5 text-white text-[11px] font-semibold">
        {value.toFixed(1)}
        <HiStar size={size - 3} />
      </span>
      {showCount && count != null && <span className="text-xs text-ink-500">({count.toLocaleString('en-IN')})</span>}
    </div>
  )
}
