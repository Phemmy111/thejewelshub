import { getWishlist } from '@/app/actions/wishlist'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function WishlistPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const items = await getWishlist()

  return (
    <main className="min-h-screen bg-[#F5F4F0] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-[#0D0D0D] tracking-tight">
              Saved for Later
            </h1>
            <p className="text-[#7A7069] mt-2">
              Your personal collection of loved pieces ({items.length} item{items.length !== 1 ? 's' : ''})
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-16 rounded-xl border border-[rgba(13,13,13,0.06)] text-center flex flex-col items-center">
            <Heart size={48} className="text-[#E8E5DF] mb-4" />
            <h2 className="text-2xl font-display font-bold text-[#0D0D0D] mb-3">No saved pieces yet</h2>
            <p className="text-[#7A7069] mb-8 max-w-md mx-auto">
              Tap the heart icon on any product to save it here for later. Build your dream jewelry collection!
            </p>
            <Link
              href="/shop"
              className="bg-[#B8882C] hover:bg-[#A67A28] text-white px-8 py-3 rounded-full font-semibold transition"
            >
              Explore the Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item: any) => {
              const product = item.products
              if (!product) return null
              const primaryImage =
                product.product_images?.find((i: any) => i.is_primary) ||
                product.product_images?.[0]
              return (
                <Link
                  key={item.product_id}
                  href={`/shop/${product.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden border border-[rgba(13,13,13,0.06)] hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="relative aspect-[4/5] bg-[#F5F4F0] overflow-hidden">
                    {primaryImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={primaryImage.url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#7A7069] text-xs uppercase tracking-wider">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-[#0D0D0D] text-base leading-snug mb-1">
                      {product.name}
                    </h3>
                    <p className="text-[#B8882C] font-semibold">{formatPrice(product.price_kobo)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
