import { useState, useEffect, useRef } from 'react'

// Fixed-position (not sticky/absolute), so it floats over content and never
// pushes other elements around - safe on mobile where extra layout shifts
// are especially disruptive. Only appears once the page has actually been
// scrolled, so it never fights for space with content on short pages.
export default function ScrollToTopButton({ threshold = 400 }) {
  const [visible, setVisible] = useState(false)
  const [justAppeared, setJustAppeared] = useState(false)
  const wasVisible = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > threshold
      setVisible(shouldShow)

      if (shouldShow && !wasVisible.current) {
        // Give it one attention-grabbing bounce on arrival, then settle.
        setJustAppeared(true)
        setTimeout(() => setJustAppeared(false), 1000)
      }
      wasVisible.current = shouldShow
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ${
        visible
          ? `opacity-100 translate-y-0 pointer-events-auto ${justAppeared ? 'animate-bounce' : ''}`
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        // Keep clear of the iOS/Android home-indicator / gesture area.
        marginBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      ↑
    </button>
  )
}
