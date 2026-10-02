'use client'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

export default function DiscountsManagerClient({ initialCodes }: { initialCodes: any[] }) {
  const [codes, setCodes] = useState(initialCodes)
  const [showForm, setShowForm] = useState(false)
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage')
  const [value, setValue] = useState('')
  const [minOrder, setMinOrder] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleCreate = async () => {
    if (!code.trim() || !value) return
    setLoading(true)
    const { data, error } = await supabase
      .from('discount_codes')
      .insert({
        code: code.trim().toUpperCase(),
        type,
        value: parseFloat(value),
        min_order_kobo: minOrder ? parseInt(minOrder) * 100 : 0,
        max_uses: maxUses ? parseInt(maxUses) : null,
        is_active: true,
      })
      .select()
      .single()

    if (!error && data) {
      setCodes(prev => [data, ...prev])
      setCode('')
      setValue('')
      setMinOrder('')
      setMaxUses('')
      setShowForm(false)
    } else {
      alert(error?.message || 'Failed to create code')
    }
    setLoading(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('discount_codes').update({ is_active: !current }).eq('id', id)
    setCodes(prev => prev.map(c => (c.id === id ? { ...c, is_active: !current } : c)))
  }

  const deleteCode = async (id: string) => {
    if (!confirm('Delete this discount code?')) return
    await supabase.from('discount_codes').delete().eq('id', id)
    setCodes(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Create Discount Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Code
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SAVE20"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8882C]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'percentage' | 'fixed')}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8882C]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={type === 'percentage' ? 'e.g. 20' : 'e.g. 1000'}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8882C]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Min Order (₦) — optional
              </label>
              <input
                type="number"
                value={minOrder}
                onChange={e => setMinOrder(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8882C]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Max Uses — optional
              </label>
              <input
                type="number"
                value={maxUses}
                onChange={e => setMaxUses(e.target.value)}
                placeholder="Leave blank for unlimited"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8882C]"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-[#0D0D0D] text-white px-5 py-2 rounded text-sm font-semibold hover:bg-[#1A1A1A] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Code'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-200 text-gray-700 px-5 py-2 rounded text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#0D0D0D] text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-[#1A1A1A] mb-6"
        >
          <Plus size={16} /> Create Discount Code
        </button>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {codes.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#B8882C]">
                    {c.type === 'percentage'
                      ? `${c.value}% OFF`
                      : `${formatPrice(c.value * 100)} OFF`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.min_order_kobo > 0 ? formatPrice(c.min_order_kobo) : 'None'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.uses_count}
                    {c.max_uses ? ` / ${c.max_uses}` : ''}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(c.id, c.is_active)}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteCode(c.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No discount codes yet. Create your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
