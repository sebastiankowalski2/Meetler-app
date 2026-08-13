import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/useAuth'
import AuthControls from './AuthControls'

// "Who am I" menu, meant to sit inside AppHeader's right slot. Positioned
// relative to its own trigger button (not the viewport), so it can never
// overlap other header content.
//
// `avatarOnly`: collapses the trigger to just a (larger) round photo, no
// name label - used on the home page where the header should stay minimal.
export default function UserMenu({ isCreator = false, avatarOnly = false }) {
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
  const avatarSize = avatarOnly ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-6 h-6'

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={label}
        className={`flex items-center gap-1 rounded-full bg-primary text-white cursor-pointer hover:bg-primary-hover transition-colors duration-150 ${avatarOnly ? 'p-0.5' : 'pl-1.5 pr-2.5 sm:pr-3 py-1 font-bold text-sm'}`}
      >
        {isCreator && (
          <span
            title="You created this event"
            className="leading-none sm:text-xl pl-2"
          >
            👑
          </span>
        )}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className={`${avatarSize} rounded-full border border-white/70`}
          />
        ) : (
          <span
            className={`${avatarSize} rounded-full bg-white/20 flex items-center justify-center text-xs`}
          >
            {label.slice(0, 1).toUpperCase()}
          </span>
        )}
        {!avatarOnly && (
          <span className="hidden xs:inline max-w-24 sm:max-w-32 truncate">
            {label}
          </span>
        )}
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
