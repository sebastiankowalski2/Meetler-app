import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import AuthControls from './AuthControls'

// Top-left "who am I" menu on an event page. There is no nickname anymore -
// the only identity is the signed-in Google account (or "not signed in").
export default function UserMenu() {
  const { user, authLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 460)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 460)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (authLoading) {
    return (
      <div className="absolute top-2 left-2">
        <h3 className="min-w-20 text-lg font-bold text-white bg-primary rounded-sm p-1 opacity-70">
          Loading…
        </h3>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="absolute top-2 left-2 z-21">
        <AuthControls compact />
      </div>
    )
  }

  const label = user.displayName || user.email || 'Account'

  return (
    <div className="absolute top-2 left-2 flex flex-col items-start">
      <button className="z-21 relative" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="min-w-20 text-lg font-bold text-white bg-primary rounded-sm p-1 cursor-pointer">
          Hi, {label}
        </h3>
      </button>

      <div
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          position: 'relative',
          zIndex: 20,
        }}
        className={`${isMobile ? 'w-full max-w-52' : 'w-full'} p-2 shadow-[0_0_10px_rgb(var(--color-primary-rgb)),inset_0_0_50px_rgb(var(--color-secondary-rgb))] border-2 border-primary z-50 text-sm lg:text-lg font-bold text-black duration-200 -mt-4.5 origin-top flex flex-col items-start gap-2 ${isOpen ? 'opacity-100 scale-100 translate-y-4' : 'translate-y-0 opacity-0 scale-95 pointer-events-none'}`}
      >
        <AuthControls showEditName />
      </div>
    </div>
  )
}
