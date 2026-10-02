import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminTransactionsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createAdminClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, reference, customer_email, customer_name, total_amount_kobo, status, paid_at, created_at')
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching transactions:', error)

  const transactions = orders || []

  return (
    <div>
      {/* Header */}
      <div className="px-4 md:px-6 py-6 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Transactions</h1>
        <p className="text-gray-600">Real-time view of all financial transactions and payment references.</p>
      </div>

      {/* Full-width table */}
      <div className="overflow-x-auto border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-xs md:text-xs md:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="hidden sm:table-cell px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="hidden sm:table-cell px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-xs md:text-sm">
            {transactions.map((tx: any) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="hidden sm:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                  {new Date(tx.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="hidden sm:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-mono text-gray-600">
                  {tx.reference}
                </td>
                <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                  <div className="text-xs md:text-sm font-medium text-gray-900">{tx.customer_name}</div>
                  <div className="text-xs md:text-sm text-gray-500">{tx.customer_email}</div>
                </td>
                <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-bold text-gray-900">
                  {formatPrice(tx.total_amount_kobo)}
                </td>
                <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tx.status === 'paid' ? 'bg-green-100 text-green-800' :
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {tx.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-xs md:text-sm">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
