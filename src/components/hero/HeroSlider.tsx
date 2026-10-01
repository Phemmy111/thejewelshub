'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const DURATION = 6000

const slides = [
  {
    id: 1,
    bg: 'radial-gradient(ellipse at 75% 50%, #1C1408 0%, #0A0A0A 65%)',
    eyebrow: 'New Collection',
    lines: ['Wear What', 'Speaks', 'for You.'],
    highlight: 1,
    sub: 'Curated jewellery & accessories, sourced for the bold and the elegant. Fast delivery across Nigeria.',
    cta: { label: 'Shop the Collection', href: '/shop' },
    cta2: { label: 'View Jewels', href: '/jewels' },
    accentX: '68%', accentY: '40%',
  },
  {
    id: 2,
    bg: 'radial-gradient(ellipse at 25% 55%, #0C0814 0%, #080808 65%)',
    eyebrow: 'Jewels Collection',
    lines: ['Shine', 'Without', 'Compromise.'],
    highlight: 0,
    sub: 'From rings to anklets — every piece handpicked for the discerning woman.',
    cta: { label: 'Explore Jewels', href: '/jewels' },
    cta2: null,
    accentX: '25%', accentY: '60%',
  },
  {
    id: 3,
    bg: 'radial-gradient(ellipse at 55% 25%, #10080C 0%, #090909 65%)',
    eyebrow: 'Premium Accessories',
    lines: ['Elevate', 'Every', 'Look.'],
    highlight: 2,
    sub: 'Wristwatches, sunglasses and belts — premium accessories for every style.',
    cta: { label: 'Shop Accessories', href: '/accessories' },
    cta2: null,
    accentX: '55%', accentY: '20%',
  },
]

export default function HeroSlider({ sliderConfig, pageContext }: { sliderConfig?: any, pageContext?: any }) {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(Date.now())

  const mediaItems = sliderConfig?.media?.length > 0 ? sliderConfig.media : slides.map((s) => ({ bg: s.bg }))
  const duration = sliderConfig?.duration || DURATION
  const transition = sliderConfig?.transition || 'fade'

  const goTo = useCallback((idx: number) => {
    setActive(idx)
    setProgress(0)
    startRef.current = Date.now()
  }, [])

  const next = useCallback(() => goTo((active + 1) % mediaItems.length), [active, goTo, mediaItems.length])

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, duration)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [next, duration])

  // Progress bar
  useEffect(() => {
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - startRef.current
      setProgress(Math.min(elapsed / duration, 1))
      requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [active, duration])

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh', backgroundColor: '#080808' }}>
      
      {/* Slides (Background + Content combined for smooth crossfade) */}
      {mediaItems.map((media: any, i: number) => {
        // Use pageContext if provided, otherwise cycle through the homepage text slides
        const textSlide = pageContext || slides[i % slides.length] 
        
        let transformStyle = 'scale(1)'
        if (transition === 'zoom') {
          transformStyle = i === active ? 'scale(1)' : 'scale(1.1)'
        } else if (transition === 'slide') {
          transformStyle = i === active ? 'translateX(0)' : 'translateX(10%)'
        }

        return (
          <div
            key={i}
            className="absolute inset-0 flex flex-col justify-center"
            style={{
              transition: `opacity 1000ms ease-in-out, transform ${duration}ms linear`,
              opacity: i === active ? 1 : 0,
              zIndex: i === active ? 2 : 1,
              pointerEvents: i === active ? 'auto' : 'none',
              transform: transformStyle,
            }}
          >
            {/* Dynamic Background */}
            {media.isVideo ? (
              <video 
                src={media.url} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            ) : media.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={media.url} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            ) : (
              <div className="absolute inset-0" style={{ background: media.bg || slides[0].bg }} />
            )}

            {/* Diagonal gold texture */}
            <div className="absolute inset-0" style={{
              opacity: 0.035,
              backgroundImage: 'repeating-linear-gradient(-45deg, #B8882C 0px, #B8882C 1px, transparent 1px, transparent 55px)',
            }} />
            
            {/* Gold orb glow */}
            <div className="absolute pointer-events-none" style={{
              left: textSlide.accentX || '50%', top: textSlide.accentY || '50%',
              width: '420px', height: '420px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(184,136,44,0.18) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
            
            {/* Gradient overlay to ensure text is readable over user uploads */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(90deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.7) 45%, rgba(8,8,8,0.2) 100%)',
            }} />

            {/* Faded JH watermark */}
            <div className="absolute right-0 top-0 bottom-0 pointer-events-none select-none" style={{ width: '50%', opacity: 0.055, zIndex: 3 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right center', filter: 'invert(1)' }} />
            </div>

            {/* Text Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 flex items-center" style={{ paddingTop: '2rem' }}>
              <div style={{ maxWidth: '580px' }}>
                <div 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem',
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
                  }}
                >
                  <span style={{ display: 'block', width: '36px', height: '1px', backgroundColor: '#B8882C', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#B8882C' }}>
                    {textSlide.eyebrow}
                  </span>
                </div>

                <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>
                  {textSlide.lines.map((line: string, li: number) => (
                    <div
                      key={li}
                      className="font-display font-bold"
                      style={{
                        display: 'block',
                        color: li === textSlide.highlight ? '#B8882C' : '#FFFFFF',
                        fontStyle: li === textSlide.highlight ? 'italic' : 'normal',
                        opacity: i === active ? 1 : 0,
                        transform: i === active ? 'translateY(0)' : 'translateY(30px)',
                        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + (li * 0.1)}s`
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </h1>

                <p 
                  style={{ 
                    marginTop: '1.5rem', color: 'rgba(255,255,255,0.58)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '400px',
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s'
                  }}
                >
                  {textSlide.sub}
                </p>

                <div 
                  style={{ 
                    display: 'flex', flexWrap: 'wrap', gap: '0.875rem', marginTop: '2.25rem',
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s'
                  }}
                >
                  {textSlide.cta && (
                    <Link href={textSlide.cta.href} className="hero-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.875rem 1.75rem', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'background-color 0.2s' }}>
                      {textSlide.cta.label}
                    </Link>
                  )}
                  {textSlide.cta2 && (
                    <Link href={textSlide.cta2.href} className="hero-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.875rem 1.75rem', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {textSlide.cta2.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Slide counter + dots */}
      <div className="absolute bottom-10 left-5 sm:left-8 z-20 flex items-center gap-5">
        <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
          {String(active + 1).padStart(2, '0')} / {String(mediaItems.length).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {mediaItems.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === active ? '28px' : '8px',
                height: '3px',
                borderRadius: '2px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: i === active ? '#B8882C' : 'rgba(255,255,255,0.3)',
                transition: 'width 0.4s ease, background-color 0.3s',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', backgroundColor: '#B8882C', width: `${progress * 100}%`, transition: 'width 0.1s linear' }} />
      </div>

      {/* Scroll cue */}
      <div className="absolute right-6 bottom-10 z-20 flex flex-col items-center gap-2 hidden md:flex" style={{ color: 'rgba(255,255,255,0.25)' }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
        <span style={{ display: 'block', width: '1px', height: '48px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
      </div>
    </section>
  )
}
