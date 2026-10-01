'use client'

import { useState } from 'react'
import { Plus, X, Image as ImageIcon, Loader2, Edit, Trash2, Search, Package } from 'lucide-react'
import { saveProduct, deleteProduct, getProductSignedUploadUrls } from '@/app/admin/products/actions'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

function stockColor(qty: number) {
  if (qty > 10) return '#22c55e'
  if (qty > 0) return '#f97316'
  return '#ef4444'
}

export default function ProductManagerClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [products, setProducts] = useState<any[]>(initialProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [stock, setStock] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<any[]>([])

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setSlug('')
    setCategoryId(categories.length > 0 ? categories[0].id : '')
    setDescription('')
    setPrice('')
    setComparePrice('')
    setStock('0')
    setIsActive(true)
    setSelectedFiles([])
    setExistingImages([])
  }

  const handleOpenNew = () => { resetForm(); setIsModalOpen(true) }

  const handleOpenEdit = (prod: any) => {
    setEditingId(prod.id)
    setName(prod.name)
    setSlug(prod.slug)
    setCategoryId(prod.category_id || '')
    setDescription(prod.description || '')
    setPrice((prod.price_kobo / 100).toString())
    setComparePrice(prod.compare_at_price_kobo ? (prod.compare_at_price_kobo / 100).toString() : '')
    setStock(prod.stock_quantity.toString())
    setIsActive(prod.is_active)
    setExistingImages(prod.product_images || [])
    setSelectedFiles([])
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let finalImages = [...existingImages.map(img => ({ url: img.url, is_primary: img.is_primary }))]

      if (selectedFiles.length > 0) {
        const filesInfo = selectedFiles.map(f => ({ name: f.name, type: f.type }))
        const urlResult = await getProductSignedUploadUrls(filesInfo)

        if (!urlResult.success || !urlResult.urls) {
          alert('Failed to get upload URLs: ' + urlResult.error)
          setIsSubmitting(false)
          return
        }

        const supabase = createClient()
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]
          const { path, token, publicUrl } = urlResult.urls[i]
          const { error } = await supabase.storage.from('product-media').uploadToSignedUrl(path, token, file)
          if (error) throw new Error('Upload failed for ' + file.name + ': ' + error.message)
          finalImages.push({ url: publicUrl, is_primary: finalImages.length === 0 && i === 0 })
        }
      }

      const productData = {
        id: editingId,
        name,
        slug,
        category_id: categoryId,
        description,
        price_kobo: Math.round(parseFloat(price) * 100),
        compare_at_price_kobo: comparePrice ? Math.round(parseFloat(comparePrice) * 100) : null,
        stock_quantity: parseInt(stock),
        is_active: isActive
      }

      const saveResult = await saveProduct(productData, finalImages)
      if (!saveResult.success) {
        alert('Failed to save product: ' + saveResult.error)
        setIsSubmitting(false)
        return
      }

      const savedProd = {
        ...saveResult.product,
        categories: categories.find(c => c.id === categoryId),
        product_images: finalImages
      }

      if (editingId) {
        setProducts(prev => prev.map(p => p.id === editingId ? savedProd : p))
      } else {
        setProducts(prev => [savedProd, ...prev])
      }
      setIsModalOpen(false)
    } catch (err: any) {
      alert('Error saving product: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    const result = await deleteProduct(id)
    if (!result.success) { alert('Failed to delete: ' + result.error); return }
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const inputCls = 'w-full bg-black/40 border border-white/10 rounded-md py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#B8882C]'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Products &amp; Inventory</h1>
          <p style={{ color: '#A19D98' }} className="text-sm">Manage your catalog, stock, and pricing.</p>
        </div>
        <button
          onClick={handleOpenNew}
          style={{ backgroundColor: '#B8882C' }}
          className="hover:opacity-90 text-white px-5 py-2.5 rounded text-sm font-semibold flex items-center gap-2 transition-opacity"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none"
              style={{ outlineColor: '#B8882C' }}
            />
          </div>
          <div className="text-white/50 text-sm">{products.length} Products</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="text-xs uppercase bg-white/5 text-white/50">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => {
                const primaryImage = product.product_images?.find((img: any) => img.is_primary) || product.product_images?.[0]
                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                          {primaryImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={16} className="text-white/30" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{product.name}</div>
                          <div className="text-xs text-white/40 font-mono mt-0.5">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-white/10 px-2.5 py-1 rounded-full text-xs font-medium">
                        {product.categories?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium" style={{ color: '#B8882C' }}>
                      {formatPrice(product.price_kobo)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: stockColor(product.stock_quantity) }}
                        />
                        {product.stock_quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.is_active ? (
                        <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>Active</span>
                      ) : (
                        <span className="text-xs font-semibold" style={{ color: '#f87171' }}>Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenEdit(product)} className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors mr-2">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 rounded transition-colors" style={{ color: '#f87171' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No products found. Click &quot;New Product&quot; to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-3xl shadow-2xl my-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Col */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Product Name</label>
                    <input required type="text" value={name} onChange={e => handleNameChange(e.target.value)} className={inputCls} placeholder="e.g., Diamond Solitaire Ring" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Slug</label>
                    <input required type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))} className={inputCls + ' font-mono text-white/60'} placeholder="diamond-solitaire-ring" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Category</label>
                    <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputCls + ' appearance-none'}>
                      <option value="" disabled>Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputCls} placeholder="Describe the piece..." />
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Price (&#8358;)</label>
                      <input required type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className={inputCls + ' font-mono'} placeholder="150000" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Compare At (&#8358;)</label>
                      <input type="number" step="0.01" min="0" value={comparePrice} onChange={e => setComparePrice(e.target.value)} className={inputCls + ' font-mono'} placeholder="200000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Stock Quantity</label>
                    <input required type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className={inputCls + ' font-mono'} />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-black/20 rounded-md border border-white/5">
                    <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4" style={{ accentColor: '#B8882C' }} />
                    <div className="text-sm">
                      <div className="font-semibold text-white">Active Product</div>
                      <div className="text-white/50 text-xs mt-0.5">Visible on the storefront</div>
                    </div>
                  </label>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Product Images</label>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {existingImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-white/10 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(239,68,68,0.8)' }}>
                            <Trash2 size={14} className="text-white" />
                          </button>
                        </div>
                      ))}
                      {selectedFiles.map((f, i) => (
                        <div key={'new-' + i} className="relative w-16 h-16 rounded overflow-hidden border group" style={{ borderColor: '#B8882C', opacity: 0.8 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(239,68,68,0.8)' }}>
                            <Trash2 size={14} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="cursor-pointer rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors border-2 border-dashed border-white/10 hover:border-[#B8882C] bg-black/20">
                      <ImageIcon className="text-white/30 mb-2" size={24} />
                      <span className="text-sm font-medium text-white/70">Click to upload images</span>
                      <span className="text-xs text-white/40 mt-1">High quality JPEGs or PNGs</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={e => {
                          if (e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded text-sm font-semibold text-white/60 hover:text-white transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white px-8 py-2.5 rounded text-sm font-bold flex items-center gap-2 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#B8882C' }}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
