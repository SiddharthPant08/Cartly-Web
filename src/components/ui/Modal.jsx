import { AnimatePresence, motion } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            className={`relative w-full ${maxWidth} rounded-2xl bg-white shadow-soft p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              {title && <h3 className="text-lg font-bold text-ink-900">{title}</h3>}
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-auto rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
              >
                <HiXMark size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
