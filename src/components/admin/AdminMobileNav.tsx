'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function AdminMobileNav({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: '📊 Overview' },
    { href: '/admin/products', label: '💎 Products' },
    { href: '/admin/categories', label: '🗂 Categories' },
    { href: '/admin/orders', label: '📦 Orders' },
    { href: '/admin/media-sliders', label: '🖼 Media Sliders' },
    { href: '/admin/customers', label: '👤 Customers' },
    { href: '/admin/reviews', label: '⭐ Reviews' },
    { href: '/admin/discounts', label: '🏷 Discounts' },
    { href: '/admin/delivery', label: '🚚 Delivery' },
    { href: '/admin/transactions', label: '💳 Transactions' },
    { href: '/admin/admins', label: '🔐 Admins' },
    { href: '/admin/settings', label: '⚙️ Settings' },
  ]

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:text-black">
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <aside className="relative flex w-64 flex-col bg-black text-white h-full overflow-y-auto">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white p-1">
              <X size={20} />
            </button>
            <div className="px-6 py-5 border-b border-white/10 shrink-0">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <span className="font-display text-lg font-bold text-[#B8882C]">
                  JH Admin
                </span>
              </Link>
              <p className="text-xs text-white/40 mt-0.5 truncate">{email}</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-[#B8882C]/20 text-[#B8882C]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="px-6 py-4 border-t border-white/10 shrink-0">
              <Link
                href="/"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                ← Back to Store
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
