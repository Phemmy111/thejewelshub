'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const DURATION = 6000

// ─── Reduced-motion hook ────────────────────────────────────────────────────
function useReducedMotion(): boolean {
  const [rm, setRm] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setRm(mq.matches)
    const h = (e: MediaQueryListEvent) => setRm(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return rm
}

// ─── Asterisk parser — "Wear the *moment*." → [{t,g}…] ────────────────────
interface LP { t: string; g: boolean }
function parseLine(text: string): LP[] {
  const parts: LP[] = []
  const re = /\*([^*]+)\*/g
  let last = 0, m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index), g: false })
    parts.push({ t: m[1], g: true })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ t: text.slice(last), g: false })
  return parts.length ? parts : [{ t: text, g: false }]
}

// ─── Default homepage slides ────────────────────────────────────────────────
const slides = [
  {
    bg: 'radial-gradient(ellipse at 75% 50%, #1C1408 0%, #0A0A0A 65%)',
    eyebrow: 'New Collection',
    lines: ['Wear What', 'Speaks', 'for *You*.'],
    sub: 'Curated jewellery & accessories, sourced for the bold and the elegant. Fast delivery across Nigeria.',
    cta: { label: 'Shop the Collection', href: '/shop' },
    cta2: { label: 'View Jewels', href: '/shop/category/jewels' },
    accentX: '68%', accentY: '40%',
  },
  {
    bg: 'radial-gradient(ellipse at 25% 55%, #0C0814 0%, #080808 65%)',
    eyebrow: 'Jewels Collection',
    lines: ['Shine', 'Without', '*Compromise*.'],
    sub: 'From rings to anklets — every piece handpicked for the discerning woman.',
    cta: { label: 'Explore Jewels', href: '/shop/category/jewels' },
    accentX: '25%', accentY: '60%',
  },
  {
    bg: 'radial-gradient(ellipse at 55% 25%, #10080C 0%, #090909 65%)',
    eyebrow: 'Premium Accessories',
    lines: ['Elevate', 'Every', '*Look*.'],
    sub: 'Wristwatches, sunglasses and belts — premium accessories for every style.',
    cta: { label: 'Shop Accessories', href: '/shop/category/accessories' },
    accentX: '55%', accentY: '20%',
  },
]

// Category page gradient fallbacks (rich blacks-with-gold tint, no AI stock photos)
const CAT_BG = [
  'radial-gradient(ellipse at 70% 45%, #1A1208 0%, #080808 70%)',
  'radial-gradient(ellipse at 30% 60%, #0E0A14 0%, #060606 70%)',
  'radial-gradient(ellipse at 55% 30%, #0F0B08 0%, #080808 70%)',
  'radial-gradient(ellipse at 75% 55%, #12100A 0%, #070707 70%)',
  'radial-gradient(ellipse at 25% 40%, #0A0C14 0%, #060606 70%)',
  'radial-gradient(ellipse at 60% 65%, #140E08 0%, #090909 70%)',
]

const GOLD_GRAD =
  'linear-gradient(90deg, #8C6518 0%, #D4A84B 35%, #F0D080 50%, #D4A84B 65%, #8C6518 100%)'

// ─── Component ──────────────────────────────────────────────────────────────
export default function HeroSlider({
  sliderConfig,
  pageContext,
}: {
  sliderConfig?: any
  pageContext?: any
}) {
  const rm = useReducedMotion()

  // Normalise text slides
  const textSlides: any[] = Array.isArray(pageContext)
    ? pageContext
    : pageContext
    ? [pageContext]
    : slides

  // Normalise media items — use DB uploads when available, else gradient-per-text-slide
  const mediaItems: any[] =
    (sliderConfig?.media?.length ?? 0) > 0
      ? sliderConfig.media
      : textSlides.map((_: any, idx: number) => ({ bg: CAT_BG[idx % CAT_BG.length] }))

  const duration: number = sliderConfig?.duration ?? DURATION
  const transition: string = sliderConfig?.transition ?? 'fade'
  const count = Math.max(mediaItems.length, textSlides.length)

  // ── State ─────────────────────────────────────────────────────────────────
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const startRef = useRef<number>(Date.now())
  const pausedAtRef = useRef<number>(0)

  const textSlide = textSlides[active % textSlides.length]
  const rotatingWords: string[] | undefined = textSlide?.rotatingWords
  const rwKey = rotatingWords?.join(',') ?? ''

  // ── Navigation ────────────────────────────────────────────────────────────
  const next = useCallback(() => {
    setActive(prev => (prev + 1) % count)
    setProgress(0)
    setWordIdx(0)
    startRef.current = Date.now()
  }, [count])

  const goTo = useCallback(
    (idx: number) => {
      setActive(idx % count)
      setProgress(0)
      setWordIdx(0)
      startRef.current = Date.now()
    },
    [count],
  )

  // ── Hover pause ───────────────────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    pausedAtRef.current = Date.now()
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    startRef.current += Date.now() - pausedAtRef.current
    setIsHovered(false)
  }, [])

  // ── Auto-advance (respects hover pause) ──────────────────────────────────
  useEffect(() => {
    if (isHovered) return
    const elapsed = Date.now() - startRef.current
    const remaining = Math.max(200, duration - elapsed)
    const id = setTimeout(() => next(), remaining)
    return () => clearTimeout(id)
  }, [active, isHovered, duration, next])

  // ── Progress bar (pauses on hover) ────────────────────────────────────────
  useEffect(() => {
    if (isHovered) return
    let raf: number
    const tick = () => {
      setProgress(Math.min((Date.now() - startRef.current) / duration, 1))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, duration, isHovered])

  // ── Rotating word slot-machine ────────────────────────────────────────────
  useEffect(() => {
    setWordIdx(0)
    if (!rotatingWords || rotatingWords.length <= 1 || rm) return
    const words = rotatingWords
    const id = setInterval(() => setWordIdx(p => (p + 1) % words.length), 2200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, rwKey, rm])

  const currentWord = rm
    ? (rotatingWords?.[0] ?? '')
    : (rotatingWords?.[wordIdx % (rotatingWords?.length ?? 1)] ?? '')

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', backgroundColor: '#080808' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background slides (crossfade + Ken Burns) ─────────────────────── */}
      {Array.from({ length: count }).map((_, i) => {
        const media: any = mediaItems[i % mediaItems.length]
        const isActive = i === active

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              transition: transition === 'slide'
                ? 'opacity 600ms ease-in-out, transform 600ms ease-in-out'
                : 'opacity 1000ms ease-in-out',
              transform: transition === 'slide' && !isActive ? 'translateX(4%)' : undefined,
            }}
          >
            {media.isVideo ? (
              <video
                src={media.url}
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : media.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ animation: rm ? undefined : `kenBurns ${duration}ms ease-in-out infinite alternate` }}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: media.bg ?? 'radial-gradient(ellipse at 60% 50%, #1C1408 0%, #0A0A0A 70%)',
                  animation: rm ? undefined : `kenBurns ${duration}ms ease-in-out infinite alternate`,
                }}
              />
            )}

            {/* ── Left-to-right dark gradient — text always readable ────── */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(100deg, rgba(4,4,4,0.95) 0%, rgba(4,4,4,0.82) 35%, rgba(4,4,4,0.35) 70%, transparent 100%)',
                zIndex: 1,
              }}
            />

            {/* Subtle diagonal gold weave texture */}
            <div
              className="absolute inset-0"
              style={{
                opacity: 0.025,
                backgroundImage:
                  'repeating-linear-gradient(-45deg, #B8882C 0px, #B8882C 1px, transparent 1px, transparent 55px)',
                zIndex: 2,
              }}
            />
          </div>
        )
      })}

      {/* ── Gold orb accent glow ──────────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: textSlide?.accentX ?? '65%',
          top: textSlide?.accentY ?? '40%',
          width: '480px',
          height: '480px',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(184,136,44,0.13) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 3,
          transition: 'left 1.2s ease, top 1.2s ease',
        }}
      />

      {/* ── JH watermark ──────────────────────────────────────────────────── */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none select-none hidden md:block"
        style={{ width: '50%', opacity: 0.045, zIndex: 3 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.jpg"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'right center',
            filter: 'invert(1)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TEXT LAYER — keyed on active so CSS animations restart each slide
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        key={'t' + active}
        className="absolute inset-0 flex flex-col justify-center"
        style={{ zIndex: 10, pointerEvents: 'none' }}
      >
        <div
          className="relative w-full max-w-7xl mx-auto px-5 sm:px-8"
          style={{ paddingTop: '2rem' }}
        >
          <div style={{ maxWidth: '600px', pointerEvents: 'auto' }}>

            {/* Eyebrow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.75rem',
                animation: rm
                  ? undefined
                  : 'blurFadeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '36px',
                  height: '1px',
                  backgroundColor: '#B8882C',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#B8882C',
                }}
              >
                {textSlide?.eyebrow ?? ''}
              </span>
            </div>

            {/* Headline — line-by-line mask reveal */}
            <h1
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              {(textSlide?.lines ?? []).map((line: string, li: number) => {
                const parts = parseLine(line)
                return (
                  <div key={li} style={{ overflow: 'hidden', display: 'block' }}>
                    <div
                      className="font-display font-bold"
                      style={{
                        display: 'block',
                        animation: rm
                          ? undefined
                          : `maskUp 0.8s cubic-bezier(0.22,1,0.36,1) ${0.3 + li * 0.12}s both`,
                      }}
                    >
                      {parts.map((part, pi) =>
                        part.g ? (
                          <span
                            key={pi}
                            style={{ position: 'relative', display: 'inline-block' }}
                          >
                            {/* Gold shimmer word */}
                            <em
                              style={{
                                fontStyle: 'italic',
                                color: '#B8882C',
                                backgroundImage: GOLD_GRAD,
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: rm
                                  ? undefined
                                  : 'shimmerStreak 1.2s linear 0.85s both',
                              }}
                            >
                              {part.t}
                            </em>
                            {/* Three sparkle glints */}
                            {!rm && (
                              <>
                                <span
                                  aria-hidden
                                  className="hero-sparkle"
                                  style={{ top: '-28%', left: '8%',  animationDelay: '1.05s' }}
                                >✦</span>
                                <span
                                  aria-hidden
                                  className="hero-sparkle"
                                  style={{ top: '-18%', left: '53%', animationDelay: '1.25s' }}
                                >✦</span>
                                <span
                                  aria-hidden
                                  className="hero-sparkle"
                                  style={{ top: '-32%', left: '84%', animationDelay: '1.45s' }}
                                >✦</span>
                              </>
                            )}
                          </span>
                        ) : (
                          <span key={pi}>{part.t}</span>
                        ),
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Rotating word — slot-machine roll */}
              {rotatingWords && rotatingWords.length > 0 && (
                <div style={{ overflow: 'hidden', display: 'block' }}>
                  {/* Screen-reader: full phrase announced once */}
                  <span className="sr-only">{rotatingWords.join(', ')}</span>
                  <em
                    key={'w' + wordIdx}
                    aria-hidden
                    className="font-display font-bold"
                    style={{
                      display: 'block',
                      fontStyle: 'italic',
                      color: '#B8882C',
                      backgroundImage: GOLD_GRAD,
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: rm ? undefined : 'slotIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
                    }}
                  >
                    {currentWord}
                  </em>
                </div>
              )}
            </h1>

            {/* Subtext — blur-fade entrance */}
            <p
              style={{
                marginTop: '1.5rem',
                color: 'rgba(255,255,255,0.60)',
                fontSize: '1rem',
                lineHeight: 1.78,
                maxWidth: '420px',
                animation: rm
                  ? undefined
                  : 'blurFadeIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.78s both',
              }}
            >
              {textSlide?.sub ?? ''}
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.875rem',
                marginTop: '2.25rem',
                animation: rm
                  ? undefined
                  : 'blurFadeIn 0.5s ease 1.1s both',
              }}
            >
              {textSlide?.cta && (
                <Link href={textSlide.cta.href} className="hero-btn-primary">
                  <span>{textSlide.cta.label}</span>
                </Link>
              )}
              {textSlide?.cta2 && (
                <Link href={textSlide.cta2.href} className="hero-btn-outline">
                  <span>{textSlide.cta2.label}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide counter + dot navigation ────────────────────────────────── */}
      <div className="absolute bottom-10 left-5 sm:left-8 z-20 flex items-center gap-5">
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.1em',
          }}
        >
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={'Go to slide ' + String(i + 1)}
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
            />
          ))}
        </div>
      </div>

      {/* ── Progress bar (fills in sync with slide duration, pauses on hover) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#B8882C',
            width: progress * 100 + '%',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* ── Scroll cue — animated gold drop ──────────────────────────────── */}
      <div
        className="absolute right-6 bottom-10 z-20 hidden md:flex"
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.25)',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '48px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '50%',
              backgroundColor: '#B8882C',
              animation: rm ? undefined : 'scrollDrop 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
