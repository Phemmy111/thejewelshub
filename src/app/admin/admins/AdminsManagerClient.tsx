'use client'

import { useState } from 'react'
import { addAdmin, removeAdmin } from './actions'
import { Trash2 } from 'lucide-react'

export function AdminsManagerClient({ initialAdmins }: { initialAdmins: any[] }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const SUPER_ADMINS = ['thejewellershub@gmail.com', 'femiadeleke2020@gmail.com']

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const res = await addAdmin(email)
    if (!res.success) {
      setError(res.error || 'Failed to add admin')
    } else {
      setEmail('')
    }
    setLoading(false)
  }

  const handleRemove = async (targetEmail: string) => {
    if (!confirm('Remove ' + targetEmail + ' from admins?')) return
    const res = await removeAdmin(targetEmail)
    if (!res.success) alert(res.error)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#0D0D0D] mb-2">Manage Admins</h1>
          <p style={{ color: '#7A7069' }} className="text-sm">Super admins can grant other users access to the admin dashboard.</p>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-xl border border-[rgba(13,13,13,0.1)] p-6 mb-8 shadow-sm">
        <form onSubmit={handleAdd} className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#7A7069] uppercase tracking-wider mb-2">Add Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              required
              className="w-full bg-[#F5F4F0] border border-[rgba(13,13,13,0.1)] rounded-md py-2.5 px-3 text-sm text-[#0D0D0D] focus:outline-none focus:bg-white"
              style={{ outlineColor: '#B8882C' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: loading ? '#A07020' : '#0D0D0D' }}
          >
            {loading ? 'Adding...' : '+ Add Admin'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-[rgba(13,13,13,0.1)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#0D0D0D]">
            <thead className="text-xs uppercase bg-[#F9F8F6] text-[#7A7069] border-b border-[rgba(13,13,13,0.1)]">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Email Address</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Role</th>
                <th className="px-6 py-4 font-semibold tracking-wider w-[100px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(13,13,13,0.08)] bg-white">
              {SUPER_ADMINS.map(sa => (
                <tr key={sa} className="hover:bg-[#F9F8F6] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{sa}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#0D0D0D] text-white uppercase">
                      Super Admin
                    </span>
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))}
              {initialAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-[#F9F8F6] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{admin.email}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-[#B8882C] bg-[#B8882C]/10 border border-[#B8882C]/20 uppercase">
                      Admin
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleRemove(admin.email)} className="text-[#A19D98] hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {initialAdmins.length === 0 && (
          <div className="p-12 text-center text-[#7A7069] text-sm">
            No regular admins added yet.
          </div>
        )}
      </div>
    </div>
  )
}
