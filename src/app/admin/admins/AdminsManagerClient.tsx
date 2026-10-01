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
    <div className="p-8 max-w-[800px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-wide">Manage Admins</h1>
        <p className="text-sm text-white/50 mt-1">Super admins can grant other users access to the admin dashboard.</p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6 mb-8 flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Add Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
            className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded text-sm font-semibold text-white transition-colors h-[38px]"
          style={{ backgroundColor: loading ? '#A07020' : '#B8882C' }}
        >
          {loading ? 'Adding...' : '+ Add Admin'}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mb-6 px-2">{error}</p>}

      {/* List */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Email Address</th>
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider w-[100px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {SUPER_ADMINS.map(sa => (
              <tr key={sa} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-sm text-white">{sa}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-white/10 text-white/70 uppercase">
                    Super Admin
                  </span>
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            ))}
            {initialAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-sm text-white">{admin.email}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-[#B8882C] bg-[#B8882C]/10 border border-[#B8882C]/20 uppercase">
                    Admin
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleRemove(admin.email)} className="text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialAdmins.length === 0 && (
          <div className="p-8 text-center text-white/40 text-sm">
            No regular admins added yet.
          </div>
        )}
      </div>
    </div>
  )
}
