import { createClient } from '@/lib/supabase/server'
import { uploadHeroSlide, deleteHeroSlide } from './actions'
import Image from 'next/image'

export default async function AdminHeroPage() {
  const supabase = await createClient()
  const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display font-bold text-[#0D0D0D]">Hero & Category Sliders</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#E8E5DF] shadow-sm mb-10">
        <h2 className="text-lg font-bold mb-4">Add New Slide</h2>
        <form action={uploadHeroSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-[#7A7069]">Media File (Image or MP4)</label>
            <input type="file" name="file" required className="w-full border border-[#E8E5DF] p-2 rounded-lg" accept="image/*,video/mp4" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-[#7A7069]">Is this a Video?</label>
            <select name="is_video" className="w-full border border-[#E8E5DF] p-2 rounded-lg">
              <option value="false">No (Image)</option>
              <option value="true">Yes (Video)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#7A7069]">Eyebrow (Small text above)</label>
            <input type="text" name="eyebrow" placeholder="e.g. New Collection" className="w-full border border-[#E8E5DF] p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#7A7069]">Headline (Main text)</label>
            <input type="text" name="headline" placeholder="e.g. Shine Without Compromise" required className="w-full border border-[#E8E5DF] p-2 rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-[#7A7069]">Subheadline</label>
            <textarea name="subheadline" placeholder="Description under headline" className="w-full border border-[#E8E5DF] p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#7A7069]">Button Label</label>
            <input type="text" name="cta_label" placeholder="e.g. Shop Now" className="w-full border border-[#E8E5DF] p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#7A7069]">Button URL</label>
            <input type="text" name="cta_url" placeholder="e.g. /shop/category/jewels" className="w-full border border-[#E8E5DF] p-2 rounded-lg" />
          </div>
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-[#0D0D0D] text-white py-3 rounded-lg font-bold hover:bg-black/80 transition">
              Upload Slide
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-lg font-bold mb-4">Current Slides</h2>
      <div className="grid grid-cols-1 gap-6">
        {slides?.map((slide) => (
          <div key={slide.id} className="flex flex-col sm:flex-row bg-white border border-[#E8E5DF] rounded-xl overflow-hidden shadow-sm">
            <div className="relative w-full sm:w-64 h-48 bg-black/5">
              {slide.is_video ? (
                <video src={slide.media_url} autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <Image src={slide.media_url} alt={slide.headline} fill className="object-cover" />
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-[#B8882C] font-bold uppercase tracking-wider mb-1">{slide.eyebrow}</p>
                <h3 className="text-xl font-display font-bold text-[#0D0D0D] mb-2">{slide.headline}</h3>
                <p className="text-sm text-[#7A7069] mb-4">{slide.subheadline}</p>
                {slide.cta_label && (
                  <span className="inline-block px-3 py-1 bg-[#F5F4F0] text-xs font-bold uppercase border border-[#E8E5DF]">
                    {slide.cta_label} → {slide.cta_url}
                  </span>
                )}
              </div>
              <form action={async () => {
                'use server'
                await deleteHeroSlide(slide.id, slide.media_url)
              }} className="mt-4 sm:mt-0 flex justify-end">
                <button type="submit" className="text-red-600 text-sm font-bold hover:underline">
                  Delete Slide
                </button>
              </form>
            </div>
          </div>
        ))}
        {(!slides || slides.length === 0) && (
          <p className="text-[#7A7069] text-sm">No slides uploaded yet.</p>
        )}
      </div>
    </div>
  )
}
