import { Link } from 'react-router-dom'
import WebImage from '../assets/web.png'
import { useAuth } from '../context/useAuth'

// A single, consistent nav bar used on every page. It's a normal-flow flex
// row (not viewport-absolute like the old badges), so nothing can overlap
// on small screens no matter how much is in the right slot.
export default function AppHeader({ onLogoClick, spin = false, right }) {
  const { user } = useAuth()

  return (
    <header className="sticky w-full top-0 z-30 flex items-center justify-between gap-2 md:gap-40 px-3 sm:px-6 py-2.5 backdrop-blur-md bg-white/50 border-b border-white/60 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <Link
        to="/"
        onClick={onLogoClick}
        className="flex items-center gap-2 shrink-0 group"
      >
        <img
          src={WebImage}
          alt="Meetler home"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-md transition-transform duration-500 ease-out group-active:scale-90 ${spin ? 'rotate-[360deg]' : 'group-hover:-rotate-6'}`}
        />
        <span className="font-display text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
          Meetler
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {user && (
          <Link
            to="/my-events"
            title="My Events"
            //className="flex items-center gap-0.5 text-sm font-bold text-primary hover:underline shrink-0"
            className="rounded-full px-3 py-2 text-sm font-bold transition-colors duration-150 cursor-pointer bg-primary text-white hover:bg-primary-hover active:bg-primary/80"
          >
            📅 <span className="sm:inline">My Events</span>
          </Link>
        )}
        {right}
      </div>
    </header>
  )
}
