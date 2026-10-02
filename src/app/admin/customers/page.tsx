import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createAdminClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('customer_email, customer_name, customer_phone, total_kobo, created_at')
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching orders for customers:', error)

  const customersMap = new Map<string, any>()
  ;(orders || []).forEach((order: any) => {
    const email = order.customer_email?.toLowerCase()
    if (!email) return
    if (!customersMap.has(email)) {
      customersMap.set(email, {
        email,
        name: order.customer_name,
        phone: order.customer_phone,
        totalSpent: 0,
        orderCount: 0,
        lastOrderDate: order.created_at
      })
    }
    const customer = customersMap.get(email)
    customer.totalSpent += order.total_kobo
    customer.orderCount += 1
  })

  const customers = Array.from(customersMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div>
      {/* Header */}
      <div className="px-4 md:px-6 py-6 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Customers</h1>
        <p className="text-gray-600">Real-time database of your buyers based on order history.</p>
      </div>

      {/* Full-width table */}
      <div className="overflow-x-auto border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-xs md:text-xs md:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="hidden sm:table-cell px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
              <th className="hidden sm:table-cell px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-xs md:text-sm">
            {customers.map((cust: any) => (
              <tr key={cust.email} className="hover:bg-gray-50">
                <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                  <div className="text-xs md:text-sm font-bold text-gray-900">{cust.name}</div>
                </td>
                <td className="hidden sm:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                  <div className="text-xs md:text-sm text-gray-900">{cust.email}</div>
                  <div className="text-xs md:text-sm text-gray-500">{cust.phone || 'No phone'}</div>
                </td>
                <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                  {cust.orderCount}
                </td>
                <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-bold text-[#B8882C]">
                  {formatPrice(cust.totalSpent)}
                </td>
                <td className="hidden sm:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                  {new Date(cust.lastOrderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-xs md:text-sm">
                  No customers found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

