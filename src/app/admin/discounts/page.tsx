import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Tag } from 'lucide-react'

export default async function AdminDiscountsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="p-8 max-w-7xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="bg-white/5 p-6 rounded-full mb-6">
        <Tag size={48} className="text-[#B8882C]" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Discounts Module</h1>
      <p className="text-white/60 max-w-md mx-auto mb-8">
        The Discount & Promo Code system is currently scheduled for the next development phase. You will soon be able to create percentage and flat-rate discounts for your customers here.
      </p>
      <button className="bg-[#B8882C] text-white px-6 py-3 rounded-md font-semibold opacity-50 cursor-not-allowed">
        Coming Soon
      </button>
    </div>
  )
}
