import { useState } from 'react'
import { HiOutlineUserCircle, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'

export default function Profile() {
  const { user, updateProfile, addresses, addAddress, removeAddress } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [addressModal, setAddressModal] = useState(false)
  const [addressForm, setAddressForm] = useState({ name: '', line1: '', city: '', state: '', pincode: '', phone: '' })

  const saveProfile = (e) => {
    e.preventDefault()
    updateProfile(form)
    setEditing(false)
  }

  const saveAddress = (e) => {
    e.preventDefault()
    addAddress(addressForm)
    setAddressForm({ name: '', line1: '', city: '', state: '', pincode: '', phone: '' })
    setAddressModal(false)
  }

  return (
    <div className="container-page py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">My profile</h1>

      <div className="rounded-2xl bg-white border border-ink-100 shadow-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <HiOutlineUserCircle size={36} />
          </div>
          {!editing && (
            <div className="flex-1">
              <p className="font-bold text-ink-900">{user.name}</p>
              <p className="text-sm text-ink-500">{user.email}</p>
            </div>
          )}
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <HiOutlinePencil size={15} /> Edit
            </Button>
          )}
        </div>

        {editing && (
          <form onSubmit={saveProfile} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-800 mb-1.5 block">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-800 mb-1.5 block">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" size="sm">Save changes</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink-900">Saved addresses</h2>
          <Button size="sm" variant="outline" onClick={() => setAddressModal(true)}>
            <HiOutlinePlus size={15} /> Add address
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card relative">
              {addr.isDefault && (
                <span className="absolute right-4 top-4 text-[10px] font-bold uppercase text-primary-600 bg-primary-50 rounded-full px-2 py-0.5">
                  Default
                </span>
              )}
              <p className="font-semibold text-ink-900 text-sm">{addr.name}</p>
              <p className="mt-1 text-sm text-ink-600">
                {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
              </p>
              <p className="mt-1 text-sm text-ink-500">Phone: {addr.phone}</p>
              {!addr.isDefault && (
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  <HiOutlineTrash size={14} /> Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal open={addressModal} onClose={() => setAddressModal(false)} title="Add new address">
        <form onSubmit={saveAddress} className="space-y-3">
          {[
            { key: 'name', label: 'Full name' },
            { key: 'line1', label: 'Address line' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            { key: 'pincode', label: 'Pincode' },
            { key: 'phone', label: 'Phone number' },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-ink-800 mb-1 block">{f.label}</label>
              <input
                required
                value={addressForm[f.key]}
                onChange={(e) => setAddressForm({ ...addressForm, [f.key]: e.target.value })}
                className="w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          ))}
          <Button type="submit" fullWidth className="mt-2">Save address</Button>
        </form>
      </Modal>
    </div>
  )
}
