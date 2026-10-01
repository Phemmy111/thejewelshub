import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatPrice } from '@/lib/utils'
import { Search, Eye } from 'lucide-react'
import { StatusSelect } from './StatusSelect'

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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#0D0D0D] mb-2">Orders</h1>
          <p style={{ color: '#7A7069' }} className="text-sm">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[rgba(13,13,13,0.1)] overflow-hidden shadow-sm">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-[#7A7069] text-sm">
            No orders found yet. When a customer checks out, it will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0D0D0D]">
              <thead className="text-xs uppercase bg-[#F9F8F6] text-[#7A7069] border-b border-[rgba(13,13,13,0.1)]">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Items</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(13,13,13,0.08)] bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F9F8F6] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0D0D0D]">
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-[#7A7069] mt-1">
                        {new Date(order.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#0D0D0D]">{order.customer_name}</div>
                      <div className="text-xs text-[#7A7069] mt-1">{order.customer_email}</div>
                      <div className="text-xs text-[#7A7069]">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#7A7069] max-w-[250px] truncate">
                        {(order.items as any[]).map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-[#B8882C]">{formatPrice(order.total_kobo)}</div>
                      <div className="text-xs text-[#A19D98] mt-1 font-mono">{order.paystack_reference.substring(0, 10)}...</div>
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
