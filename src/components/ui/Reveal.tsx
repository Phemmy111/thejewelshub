'use client'

import { useEffect, useRef, useState } from 'react'

export function Reveal({ 
  children, 
  delay = 0,
  direction = 'up' 
}: { 
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' 
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const y = direction === 'up' ? 40 : 0
  const x = direction === 'left' ? 40 : direction === 'right' ? -40 : 0

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : `translate(${x}px, ${y}px)`,
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  )
}
