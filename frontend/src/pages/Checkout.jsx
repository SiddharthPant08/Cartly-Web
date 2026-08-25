import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  HiOutlineCreditCard,
  HiOutlineBanknotes,
  HiOutlineDevicePhoneMobile,
  HiCheckCircle,
} from 'react-icons/hi2'
import toast from 'react-hot-toast'

import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { formatPrice } from '../utils/format'
import apiClient from '../api/axiosClient.js'

const paymentMethods = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: HiOutlineCreditCard,
  },
  {
    id: 'upi',
    label: 'UPI',
    icon: HiOutlineDevicePhoneMobile,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    icon: HiOutlineBanknotes,
  },
]

export default function Checkout() {
  const { items, totals, clearCart } = useCart()
  const { addresses } = useAuth()
  const navigate = useNavigate()

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [payment, setPayment] = useState('card')
  const [placing, setPlacing] = useState(false)

  // Select default address automatically
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress =
        addresses.find((address) => address.isDefault) ||
        addresses[0]

      setSelectedAddress(
        defaultAddress._id || defaultAddress.id
      )
    }
  }, [addresses, selectedAddress])

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const handlePlaceOrder = async () => {
    const address = addresses.find(
      (address) =>
        (address._id || address.id) === selectedAddress
    )

    if (!address) {
      toast.error('Please select a delivery address')
      return
    }

    setPlacing(true)

    try {
      const response = await apiClient.post('/orders', {
        shippingAddress: {
        fullName: address.fullName || address.name,
        phone: address.phone,
        addressLine: address.addressLine || address.line1,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode || address.pincode,
        country: address.country || 'India',
      },
        paymentMethod: payment,
      })

      const order = response.data.order

      // Backend already cleared the MongoDB cart.
      await clearCart()

      toast.success('Order placed successfully!')

      navigate(`/success/${order._id}`)
    } catch (error) {
      console.error('Place order error:', error)

      const message =
        error.response?.data?.message ||
        'Unable to place order. Please try again.'

      toast.error(message)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">

          {/* Address */}
          <div className="rounded-2xl bg-white border border-ink-100 shadow-card p-5">
            <h2 className="font-bold text-ink-900 mb-4">
              1. Delivery address
            </h2>

            <div className="space-y-3">
              {addresses.map((addr) => {
                const addressId = addr._id || addr.id

                return (
                  <label
                    key={addressId}
                    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedAddress === addressId
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-ink-200 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addressId}
                      checked={
                        selectedAddress === addressId
                      }
                      onChange={() =>
                        setSelectedAddress(addressId)
                      }
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {addr.name || 'Delivery address'}
                      </p>

                      <p className="text-sm text-ink-600 mt-0.5">
                        {addr.line1}, {addr.city},{' '}
                        {addr.state} {addr.pincode}
                      </p>

                      <p className="text-xs text-ink-500 mt-0.5">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl bg-white border border-ink-100 shadow-card p-5">
            <h2 className="font-bold text-ink-900 mb-4">
              2. Payment method
            </h2>

            <div className="grid sm:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer transition-colors ${
                    payment === method.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-ink-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={payment === method.id}
                    onChange={() =>
                      setPayment(method.id)
                    }
                  />

                  <method.icon
                    size={22}
                    className={
                      payment === method.id
                        ? 'text-primary-600'
                        : 'text-ink-500'
                    }
                  />

                  <span className="text-xs font-medium text-ink-800 text-center">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl bg-white border border-ink-100 shadow-card p-5">
            <h2 className="font-bold text-ink-900 mb-4">
              3. Review items ({items.length})
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 line-clamp-1">
                      {item.title}
                    </p>

                    <p className="text-xs text-ink-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-ink-900 shrink-0">
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-white border border-ink-100 shadow-card p-5 sticky top-24">
          <h2 className="font-bold text-ink-900 mb-4">
            Order summary
          </h2>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>

              <span className="text-ink-900 font-medium">
                {formatPrice(totals.subtotal)}
              </span>
            </div>

            {totals.savings > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>You save</span>

                <span className="font-medium">
                  {formatPrice(totals.savings)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-ink-600">
              <span>Shipping</span>

              <span className="text-ink-900 font-medium">
                {totals.shipping === 0
                  ? 'Free'
                  : formatPrice(totals.shipping)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-ink-100 flex justify-between">
            <span className="font-bold text-ink-900">
              Total
            </span>

            <span className="font-bold text-lg text-ink-900">
              {formatPrice(totals.total)}
            </span>
          </div>

          <Button
            fullWidth
            size="lg"
            className="mt-5"
            disabled={!selectedAddress || placing}
            onClick={handlePlaceOrder}
          >
            {placing ? (
              <>
                <Spinner size={16} />
                Placing order…
              </>
            ) : (
              <>
                <HiCheckCircle size={18} />
                Place order
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}