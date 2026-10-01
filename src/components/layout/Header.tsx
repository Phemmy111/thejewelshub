'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Search, User, Menu, X, Settings, Package, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useCartStore } from '@/store/cart'

function CartTrigger({ scrolled }: { scrolled: boolean }) {
  const { items, setIsOpen } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <button 
      onClick={() => setIsOpen(true)}
      aria-label="Cart" 
      className="relative p-2 rounded-full transition-colors hover:bg-black/5"
    >
      <ShoppingBag size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
      {mounted && itemCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] rounded-full text-[10px] font-bold flex items-center justify-center"
          style={{ backgroundColor: '#B8882C', color: '#FFFFFF' }}
        >
          {itemCount}
        </span>
      )}
    </button>
  )
}

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
          <button aria-label="Search" className="p-2 rounded-full transition-colors hover:bg-black/5">
            <Search size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
          </button>
          
          <span key="auth">
            <SignedIn>
              <div className="flex items-center gap-2">
                <Link href="/wishlist" aria-label="Saved for later" className="p-2 rounded-full transition-colors hover:bg-black/5 block" title="Saved for Later">
                  <Heart size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
                </Link>
                <Link href="/account/orders" aria-label="My Orders" className="p-2 rounded-full transition-colors hover:bg-black/5 block" title="My Orders">
                  <Package size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
                </Link>
                <UserButton afterSignOutUrl="/">
                  <UserButton.MenuItems>
                    <UserButton.Link 
                      label="My Orders" 
                      href="/account/orders" 
                      labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>} 
                    />
                    <UserButton.Link 
                      label="Admin Dashboard" 
                      href="/admin" 
                      labelIcon={<Settings size={14} />} 
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" aria-label="Sign in" className="p-2 rounded-full transition-colors hover:bg-black/5 block">
                <User size={19} style={{ color: scrolled ? '#0D0D0D' : '#FFFFFF' }} />
              </Link>
            </SignedOut>
          </span>
          
          <CartTrigger scrolled={scrolled} />

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
            <SignedIn>
              <div className="flex flex-col gap-4">
                <Link href="/wishlist" className="text-base font-medium flex items-center gap-2 text-[#0D0D0D]" onClick={() => setMobileOpen(false)}>
                  <Heart size={18} />
                  Saved for Later
                </Link>
                <Link href="/account/orders" className="text-base font-medium flex items-center gap-2 text-[#0D0D0D]" onClick={() => setMobileOpen(false)}>
                  <Package size={18} />
                  My Orders
                </Link>
              </div>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-medium" style={{ color: '#B8882C' }} onClick={() => setMobileOpen(false)}>
                Sign In / Create Account
              </Link>
            </SignedOut>
          </div>
        </nav>
      )}
    </header>
  )
}
