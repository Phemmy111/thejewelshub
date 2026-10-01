'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const navLinks = [
  { href: '/shop', label: 'Shop All' },
  { href: '/shop/category/accessories', label: 'Accessories' },
  { href: '/shop/category/jewels', label: 'Jewels' },
  { href: '/shop', label: 'New Arrivals' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid #E8E5DF' : '1px solid rgba(255,255,255,0.12)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/brand/logo.jpg"
              alt="The Jeweller's Hub"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span
            className="font-display text-lg font-bold leading-tight hidden sm:block"
            style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }}
          >
            The Jeweller&apos;s Hub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide transition-colors duration-200"
              style={{
                color: scrolled ? '#0D0D0D' : 'rgba(255,255,255,0.9)',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#B8882C')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#0D0D0D' : 'rgba(255,255,255,0.9)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {[
            <button key="search" aria-label="Search" className="p-2 rounded-full transition-colors hover:bg-black/5">
              <Search size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
            </button>,
            <span key="auth">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in" aria-label="Sign in" className="p-2 rounded-full transition-colors hover:bg-black/5 block">
                  <User size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
                </Link>
              </SignedOut>
            </span>,
            <button key="cart" aria-label="Cart" className="relative p-2 rounded-full transition-colors hover:bg-black/5">
              <ShoppingBag size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
              <span
                className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: '#B8882C', color: '#FFFFFF' }}
              >
                0
              </span>
            </button>,
          ]}

          <button
            className="md:hidden p-2 rounded-full transition-colors hover:bg-black/5"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen
              ? <X size={20} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
              : <Menu size={20} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
            }
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-[#E8E5DF] px-6 py-6 flex flex-col gap-5">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-[#0D0D0D] transition-colors"
              style={{ letterSpacing: '0.03em' }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={e => (e.currentTarget.style.color = '#B8882C')}
              onMouseLeave={e => (e.currentTarget.style.color = '#0D0D0D')}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-[#E8E5DF] pt-4 mt-2">
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-medium" style={{ color: '#B8882C' }}>
                Sign In / Create Account
              </Link>
            </SignedOut>
          </div>
        </nav>
      )}
    </header>
  )
}
