'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'

const STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled']

export function StatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setLoading(true)
    const res = await updateOrderStatus(orderId, newStatus)
    if (!res.success) {
      alert('Failed to update status: ' + res.error)
      setStatus(currentStatus) // Revert on failure
    }
    setLoading(false)
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 border focus:outline-none transition-colors cursor-pointer ${
        status === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
        status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
        status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
        status === 'processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
        'bg-[#F5F4F0] text-[#0D0D0D] border-[rgba(13,13,13,0.1)]'
      }`}
    >
      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}
