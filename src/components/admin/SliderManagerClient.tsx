'use client'

import { useState } from 'react'
import { Plus, X, Video, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'
import { saveMediaSliders, uploadSliderFiles } from '@/app/admin/media-sliders/actions'

export function SliderManagerClient({ initialSliders, categories }: { initialSliders: any[], categories: any[] }) {
  const [sliders, setSliders] = useState<any[]>(initialSliders)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [targetPage, setTargetPage] = useState('/')
  const [transition, setTransition] = useState('fade')
  const [duration, setDuration] = useState('5000')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const targetOptions = [
    { value: '/', label: 'Homepage Background Slider (/)' },
    { value: '/shop', label: 'Shop All Background Slider (/shop)' },
    ...categories.map(c => ({ value: `/shop/category/${c.slug}`, label: `Category: ${c.name} (/shop/category/${c.slug})` }))
  ]

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      let newMedia: any[] = []
      if (selectedFiles.length > 0) {
        const formData = new FormData()
        selectedFiles.forEach(f => formData.append('files', f))
        
        const uploadResult = await uploadSliderFiles(formData)
        if (!uploadResult.success) {
          alert('Upload failed: ' + uploadResult.error)
          setIsSubmitting(false)
          return
        }
        newMedia = uploadResult.urls!
      }

      const newSlider = {
        id: crypto.randomUUID(),
        targetPage,
        transition,
        duration: parseInt(duration),
        media: newMedia
      }

      // If a slider for this target already exists, replace it, otherwise add it
      const existingIndex = sliders.findIndex(s => s.targetPage === targetPage)
      let updatedSliders = [...sliders]
      if (existingIndex >= 0) {
        updatedSliders[existingIndex] = {
          ...updatedSliders[existingIndex],
          transition,
          duration: parseInt(duration),
          media: [...updatedSliders[existingIndex].media, ...newMedia]
        }
      } else {
        updatedSliders.push(newSlider)
      }

      await saveMediaSliders(updatedSliders)
      setSliders(updatedSliders)
      setIsModalOpen(false)
      setSelectedFiles([])
    } catch (err) {
      console.error(err)
      alert('Failed to save slider')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSlider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entire slider?')) return
    const updated = sliders.filter(s => s.id !== id)
    await saveMediaSliders(updated)
    setSliders(updated)
  }

  const handleDeleteMedia = async (sliderId: string, mediaIndex: number) => {
    const updated = sliders.map(s => {
      if (s.id === sliderId) {
        const newMedia = [...s.media]
        newMedia.splice(mediaIndex, 1)
        return { ...s, media: newMedia }
      }
      return s
    })
    await saveMediaSliders(updated)
    setSliders(updated)
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D0D0D]">Media Sliders</h1>
        <p className="text-[#7A7069] mt-2">Configure animated sliders for the homepage and individual category pages.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#E8E5DF] shadow-sm mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Manage Sliders</h2>
          <p className="text-[#7A7069] text-sm">Select a target to configure its slider.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#1ea850] text-white px-5 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 transition"
        >
          <Plus size={16} /> New Slider
        </button>
      </div>

      <div className="space-y-6">
        {sliders.map(slider => {
          const targetName = targetOptions.find(t => t.value === slider.targetPage)?.label || slider.targetPage
          
          return (
            <div key={slider.id} className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0D0D0D]">{targetName}</h3>
                  <div className="flex gap-3 mt-2">
                    <span className="bg-[#F5F4F0] text-[#7A7069] px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{slider.transition}</span>
                    <span className="bg-[#F5F4F0] text-[#7A7069] px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">⏱ {slider.duration / 1000}s</span>
                    <span className="bg-[#F5F4F0] text-[#7A7069] px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{slider.media.length} items</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteSlider(slider.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {slider.media.map((m: any, idx: number) => (
                  <div key={idx} className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-black/10 group bg-black">
                    {m.isVideo ? (
                      <video src={m.url} className="w-full h-full object-cover opacity-80" muted />
                    ) : (
                      <img src={m.url} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-2 left-2 text-white drop-shadow-md">
                      {m.isVideo ? <Video size={14} /> : <ImageIcon size={14} />}
                    </div>
                    <button 
                      onClick={() => handleDeleteMedia(slider.id, idx)}
                      className="absolute inset-0 bg-red-600/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {sliders.length === 0 && (
          <div className="text-center py-12 text-[#7A7069]">
            <p>No sliders configured yet. Click "New Slider" to begin.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#E8E5DF]">
              <h2 className="text-xl font-bold">Configure Slider</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7A7069] hover:bg-black/5 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-[#0D0D0D] mb-2">Target Page</label>
                  <select 
                    value={targetPage} onChange={e => setTargetPage(e.target.value)}
                    className="w-full border border-[#E8E5DF] rounded-md p-2.5 focus:outline-none focus:border-[#B8882C]"
                  >
                    {targetOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0D0D0D] mb-2">Transition Animation</label>
                  <select 
                    value={transition} onChange={e => setTransition(e.target.value)}
                    className="w-full border border-[#E8E5DF] rounded-md p-2.5 focus:outline-none focus:border-[#B8882C]"
                  >
                    <option value="fade">Fade</option>
                    <option value="zoom">Zoom</option>
                    <option value="slide">Slide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0D0D0D] mb-2">Slide Duration (ms)</label>
                  <input 
                    type="number" value={duration} onChange={e => setDuration(e.target.value)}
                    className="w-full border border-[#E8E5DF] rounded-md p-2.5 focus:outline-none focus:border-[#B8882C]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-[#0D0D0D]">Media Items</label>
                  <label className="cursor-pointer text-sm font-bold text-[#B8882C] hover:underline flex items-center gap-1">
                    <Plus size={14} /> Add Media
                    <input 
                      type="file" multiple accept="image/*,video/mp4" className="hidden" 
                      onChange={e => {
                        if (e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
                      }}
                    />
                  </label>
                </div>
                <div className="border-2 border-dashed border-[#E8E5DF] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#F5F4F0]/50">
                  {selectedFiles.length > 0 ? (
                    <div className="flex gap-4 flex-wrap justify-center">
                      {selectedFiles.map((f, i) => {
                        const isVideo = f.type.startsWith('video/')
                        const objectUrl = URL.createObjectURL(f)
                        return (
                          <div key={i} className="relative w-24 h-24 rounded-lg bg-black/5 overflow-hidden flex items-center justify-center border border-[#E8E5DF]">
                            {isVideo ? (
                              <video src={objectUrl} className="w-full h-full object-cover opacity-80" muted />
                            ) : (
                              <img src={objectUrl} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-1 left-1 text-white drop-shadow-md">
                              {isVideo ? <Video size={12} /> : <ImageIcon size={12} />}
                            </div>
                            <button onClick={() => {
                              setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))
                              URL.revokeObjectURL(objectUrl)
                            }} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500 hover:bg-red-50">
                              <X size={12} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-[#7A7069] mb-3 opacity-30" />
                      <p className="text-[#7A7069] text-sm">Click "Add Media" to upload images or MP4 videos.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#E8E5DF] flex justify-end gap-3 bg-[#F5F4F0]/30">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-md font-bold text-[#7A7069] hover:bg-black/5 transition">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSubmitting}
                className="bg-[#22c55e] hover:bg-[#1ea850] text-white px-5 py-2.5 rounded-md font-bold flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Save Slider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
