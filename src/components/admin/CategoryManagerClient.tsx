'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { saveCategory, deleteCategory } from '@/app/admin/categories/actions'

export default function CategoryManagerClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        active: category.active
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        active: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const dataToSave = {
        id: editingCategory?.id,
        ...formData
      }
      
      const res = await saveCategory(dataToSave)
      if (!res.success) {
        alert(res.error)
      } else {
        // Optimistic UI update
        if (editingCategory) {
          setCategories(categories.map(c => c.id === editingCategory.id ? res.data?.[0] : c))
        } else {
          setCategories([res.data?.[0], ...categories])
        }
        handleCloseModal()
      }
    } catch (err: any) {
      alert('Error saving category: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This might affect products attached to it.')) {
      const res = await deleteCategory(id)
      if (res.success) {
        setCategories(categories.filter(c => c.id !== id))
      } else {
        alert(res.error)
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">All Categories</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#B8882C] text-white px-4 py-2 rounded hover:bg-[#a07626] transition-colors font-medium text-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  {cat.description && <div className="text-xs text-gray-500 mt-1">{cat.description}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {cat.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(cat)} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                  No categories found. Create your first category to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#B8882C] focus:ring-1 focus:ring-[#B8882C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#B8882C] focus:ring-1 focus:ring-[#B8882C]"
                />
                <p className="text-[10px] text-white/40 mt-1">e.g., "rings", "diamond-necklaces"</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#B8882C] focus:ring-1 focus:ring-[#B8882C]"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 rounded border-white/20 text-[#B8882C] focus:ring-[#B8882C] focus:ring-offset-black bg-black/40"
                />
                <label htmlFor="active" className="text-sm text-white/80 select-none cursor-pointer">
                  Category is active and visible
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#B8882C] hover:bg-[#a07626] text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
