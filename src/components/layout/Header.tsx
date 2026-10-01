'use client'

import Link from 'next/link'
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/shop', label: 'Shop All' },
    { href: '/accessories', label: 'Accessories' },
    { href: '/jewels', label: 'Jewels' },
    { href: '/new-arrivals', label: 'New Arrivals' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-display text-xl font-bold text-black gold-shimmer">
            The Jeweller&apos;s Hub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-gold)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Search size={20} />
          </button>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              aria-label="Sign in"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User size={20} />
            </Link>
          </SignedOut>

          <button
            aria-label="Cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag size={20} />
            {/* Cart badge — wired up in Phase 5 */}
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[var(--color-gold)] text-[10px] font-bold text-black flex items-center justify-center">
              0
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-[var(--color-border)] px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-[var(--color-foreground)] hover:text-[var(--color-gold)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
