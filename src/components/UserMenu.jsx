import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/useAuth'
import AuthControls from './AuthControls'

// "Who am I" menu, meant to sit inside AppHeader's right slot. Positioned
// relative to its own trigger button (not the viewport), so it can never
// overlap other header content.
export default function UserMenu({ isCreator = false }) {
  const { user, authLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (authLoading) {
    return (
      <span className="text-sm font-bold opacity-60 hidden sm:inline">
        Loading…
      </span>
    )
  }

  if (!user) {
    return <AuthControls compact />
  }

  const label = user.displayName || user.email || 'Account'

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full bg-primary text-white pl-1.5 pr-2.5 sm:pr-3 py-1 font-bold text-sm cursor-pointer hover:bg-primary-hover transition-colors duration-150"
      >
        {isCreator && (
          <span title="You created this event" className="text-base leading-none">
            👑
          </span>
        )}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full border border-white/70"
          />
        ) : (
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
            {label.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="hidden xs:inline max-w-24 sm:max-w-32 truncate">
          {label}
        </span>
      </button>

      <div
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        className={`absolute right-0 top-full mt-2 w-52 p-3 rounded-2xl shadow-xl border border-black/5 flex flex-col items-start gap-2 origin-top-right transition-all duration-150 z-40 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <AuthControls showEditName />
      </div>
    </div>
  )
}
