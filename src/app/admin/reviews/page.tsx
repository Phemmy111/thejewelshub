import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Star } from 'lucide-react'

export default async function AdminReviewsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="p-8 max-w-7xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="bg-black/5 p-6 rounded-full mb-6">
        <Star size={48} className="text-[#B8882C]" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Reviews</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        The Customer Reviews system is currently scheduled for the next development phase. Once activated, you will be able to moderate, approve, and reply to customer reviews here.
      </p>
      <button className="bg-[#B8882C] text-white px-6 py-3 rounded-md font-semibold opacity-50 cursor-not-allowed">
        Coming Soon
      </button>
    </div>
  )
}
