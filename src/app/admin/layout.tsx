import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress

  // TODO: Phase 3 — check email against admins table in Supabase
  // For now, allow any signed-in user to see the admin shell (gate added in Phase 3)

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-black text-white min-h-screen">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin">
            <span className="font-display text-lg font-bold text-[var(--color-gold)]">
              JH Admin
            </span>
          </Link>
          <p className="text-xs text-white/40 mt-0.5 truncate">{email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: '/admin', label: '📊 Overview' },
            { href: '/admin/products', label: '💎 Products' },
            { href: '/admin/categories', label: '🗂 Categories' },
            { href: '/admin/orders', label: '📦 Orders' },
            { href: '/admin/hero', label: '🖼 Hero Slider' },
            { href: '/admin/customers', label: '👤 Customers' },
            { href: '/admin/reviews', label: '⭐ Reviews' },
            { href: '/admin/discounts', label: '🏷 Discounts' },
            { href: '/admin/delivery', label: '🚚 Delivery' },
            { href: '/admin/transactions', label: '💳 Transactions' },
            { href: '/admin/admins', label: '🔐 Admins' },
            { href: '/admin/settings', label: '⚙️ Settings' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-[var(--color-muted)] font-medium">Admin Dashboard</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
