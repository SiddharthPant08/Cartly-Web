import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCheckCircle } from 'react-icons/hi2'
import { useOrders } from '../context/OrdersContext.jsx'
import Button from '../components/ui/Button.jsx'
import { formatPrice } from '../utils/format'

export default function Success() {
  const { orderId } = useParams()
  const { getOrderById } = useOrders()
  const order = getOrderById(orderId)

  return (
    <div className="container-page py-16 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-2xl bg-white border border-ink-100 shadow-soft p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
        >
          <HiCheckCircle size={40} />
        </motion.div>

        <h1 className="mt-5 text-2xl font-bold text-ink-900">Order placed successfully!</h1>
        <p className="mt-2 text-sm text-ink-500">
          Thanks for shopping with Cartly. We've sent a confirmation to your email.
        </p>

        {order && (
          <div className="mt-6 rounded-xl bg-ink-100 p-4 text-left space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Order ID</span>
              <span className="font-semibold text-ink-900">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Amount paid</span>
              <span className="font-semibold text-ink-900">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Payment method</span>
              <span className="font-semibold text-ink-900">{order.paymentMethod}</span>
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders">
            <Button variant="outline" fullWidth>View orders</Button>
          </Link>
          <Link to="/products">
            <Button fullWidth>Continue shopping</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
