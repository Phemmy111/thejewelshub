import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { formatPrice } from '@/lib/utils'

export default async function AdminCustomersPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createAdminClient()
  
  // Fetch all orders to build customer profiles
  const { data: orders, error } = await supabase
    .from('orders')
    .select('customer_email, customer_name, customer_phone, total_amount_kobo, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders for customers:', error)
  }

  // Aggregate orders by customer email
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
    customer.totalSpent += order.total_amount_kobo
    customer.orderCount += 1
    // Since orders are sorted descending, the first one encountered is the most recent
  })

  const customers = Array.from(customersMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Real-time database of your buyers based on order history.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((cust: any) => (
                <tr key={cust.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{cust.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cust.email}</div>
                    <div className="text-sm text-gray-500">{cust.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cust.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#B8882C]">
                    {formatPrice(cust.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(cust.lastOrderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No customers found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
