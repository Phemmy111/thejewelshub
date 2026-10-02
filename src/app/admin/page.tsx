import { createAdminClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function AdminOverviewPage() {
  const supabase = await createAdminClient()

  const { data: products } = await supabase.from('products').select('id, stock_quantity')
  const { data: orders } = await supabase.from('orders').select('total_amount_kobo, status, created_at')

  const totalProducts = products?.length || 0
  const lowStock = products?.filter(p => (p.stock_quantity || 0) <= 5).length || 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let todaysRevenue = 0
  let ordersToday = 0

  if (orders) {
    orders.forEach(order => {
      const orderDate = new Date(order.created_at)
      if (orderDate >= today) {
        ordersToday++
        if (order.status === 'paid' || order.status === 'completed') {
          todaysRevenue += order.total_amount_kobo
        }
      }
    })
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[var(--color-foreground)] mb-2">
        Overview
      </h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">
        Real-time analytics for your store.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Revenue", value: formatPrice(todaysRevenue) },
          { label: 'Orders Today', value: ordersToday.toString() },
          { label: 'Total Products', value: totalProducts.toString() },
          { label: 'Low Stock', value: lowStock.toString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm"
          >
            <p className="text-xs text-[var(--color-muted)] font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-[var(--color-foreground)] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-[var(--color-muted)]">
          Welcome to your live admin dashboard. Select an option from the sidebar to manage your store.
        </p>
      </div>
    </div>
  )
}
