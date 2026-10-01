import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Package } from 'lucide-react'

export const revalidate = 0

export default async function CustomerOrdersPage() {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in?redirect_url=/account/orders')
  }

  const email = user.emailAddresses[0].emailAddress
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  )

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-5 py-24 sm:py-32 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-[#0D0D0D] mb-2">My Orders</h1>
        <p className="text-[#7A7069]">Track and manage your past purchases.</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="text-center py-20 bg-white border border-[rgba(13,13,13,0.1)] rounded-lg">
          <Package className="w-12 h-12 text-[#E8E5DF] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0D0D0D] mb-2">No orders yet</h2>
          <p className="text-[#7A7069] mb-6">Looks like you haven't made a purchase yet.</p>
          <Link 
            href="/shop"
            className="inline-block bg-[#0D0D0D] text-white px-6 py-3 rounded text-sm font-semibold tracking-wider uppercase hover:bg-[#B8882C] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-[rgba(13,13,13,0.1)] rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-[#F9F8F6] px-6 py-4 border-b border-[rgba(13,13,13,0.1)] flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <p className="text-xs text-[#7A7069] uppercase tracking-wider font-semibold mb-1">Order Placed</p>
                  <p className="text-sm font-medium text-[#0D0D0D]">{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A7069] uppercase tracking-wider font-semibold mb-1">Total</p>
                  <p className="text-sm font-medium text-[#0D0D0D]">{formatPrice(order.total_kobo)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A7069] uppercase tracking-wider font-semibold mb-1">Order Ref</p>
                  <p className="text-sm font-mono text-[#0D0D0D]">{order.paystack_reference}</p>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-[#E8E5DF] text-[#0D0D0D]'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {(order.items as any[]).map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-[#F5F4F0] rounded overflow-hidden flex-shrink-0 relative">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#A19D98]">No image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#0D0D0D] truncate">{item.name}</h4>
                        <div className="text-xs text-[#7A7069] mt-1 space-x-2">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[#0D0D0D]">
                        {formatPrice(item.priceKobo * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Movement / Delivery tracking simplified text */}
                <div className="mt-6 pt-6 border-t border-[rgba(13,13,13,0.1)]">
                  <h4 className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2">Delivery Details</h4>
                  <p className="text-sm text-[#7A7069]">{order.delivery_address}</p>
                  
                  {order.status === 'paid' && (
                    <p className="text-sm text-[#B8882C] mt-3 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B8882C] animate-pulse"></span>
                      Order confirmed. Preparing for shipment.
                    </p>
                  )}
                  {order.status === 'processing' && (
                    <p className="text-sm text-[#B8882C] mt-3 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B8882C] animate-pulse"></span>
                      Your order is currently being processed.
                    </p>
                  )}
                  {order.status === 'shipped' && (
                    <p className="text-sm text-blue-600 mt-3 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Your order has shipped and is on its way!
                    </p>
                  )}
                  {order.status === 'delivered' && (
                    <p className="text-sm text-green-600 mt-3 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600"></span>
                      Package delivered. Thank you for shopping with us!
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
