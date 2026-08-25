import { HiMinus, HiPlus } from 'react-icons/hi2'

export default function QuantityStepper({ value, onChange, min = 1, max = 10, size = 'md' }) {
  const dims = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm'

  return (
    <div className="inline-flex items-center rounded-xl border border-ink-300 overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${dims} flex items-center justify-center text-ink-700 hover:bg-ink-100 disabled:opacity-40 disabled:hover:bg-transparent`}
        aria-label="Decrease quantity"
      >
        <HiMinus size={14} />
      </button>
      <span className={`${dims} flex items-center justify-center font-semibold text-ink-900 border-x border-ink-200`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${dims} flex items-center justify-center text-ink-700 hover:bg-ink-100 disabled:opacity-40 disabled:hover:bg-transparent`}
        aria-label="Increase quantity"
      >
        <HiPlus size={14} />
      </button>
    </div>
  )
}
