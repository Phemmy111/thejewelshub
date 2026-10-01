import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatPrice } from '@/lib/utils'
import { Search, Eye } from 'lucide-react'

// Revalidate this page every 0 seconds (always fresh)
export const revalidate = 0

async function getOrders() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // Read-only on this page
      }
    }
  )

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  return data
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Orders</h1>
          <p className="text-sm text-white/50 mt-1">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-sm">
            No orders found yet. When a customer checks out, it will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white/90">
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {new Date(order.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white/90">{order.customer_name}</div>
                      <div className="text-xs text-white/40 mt-1">{order.customer_email}</div>
                      <div className="text-xs text-white/40">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        order.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white/70 max-w-[250px] truncate">
                        {(order.items as any[]).map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-[#B8882C]">{formatPrice(order.total_kobo)}</div>
                      <div className="text-xs text-white/30 mt-1 font-mono">{order.paystack_reference.substring(0, 10)}...</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
