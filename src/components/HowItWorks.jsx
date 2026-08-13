import { useState, useEffect, useRef } from 'react'

// A small "?" trigger that reveals the how-it-works list as a floating
// popover instead of a static block that pushes the rest of the page down.
// Same relative-container + absolute-panel + click-outside-close pattern as
// UserMenu / ParticipantsDropdown, so it behaves consistently on both
// desktop (works fine with a click too) and mobile (no "hover" on touch).
export default function HowItWorks({ EventView, EventPage }) {
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

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="How it works"
        aria-label="How it works"
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-primary border-2 border-primary font-extrabold flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 hover:rotate-6 ${isOpen ? 'scale-110 rotate-6' : ''}`}
      >
        ?
      </button>

      <div
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
        className={`absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl shadow-xl border border-black/5 origin-top-right transition-all duration-200 z-40 ${isOpen ? 'opacity-100 scale-100 translate-y-0 translate-x-24 sm:translate-x-0' : 'opacity-0 scale-90 sm:translate-x-0 translate-x-14 -translate-y-1 pointer-events-none'}`}
      >
        <h3 className="text-lg font-extrabold mb-2 text-primary">
          📌 How it works
        </h3>
        <ol
          style={{ listStyleType: 'decimal' }}
          className="pl-4 text-left flex flex-col gap-1.5"
        >
          {!EventView && (
            <li className="font-bold text-sm">Create an event.</li>
          )}

          <li className="font-bold text-sm">
            Mark the days when you are available.
          </li>

          {!EventView && (
            <li className="font-bold text-sm">
              Share the event link with others.
            </li>
          )}
          {!EventView && (
            <li className="font-bold text-sm">
              Easily find the best meeting dates.
            </li>
          )}
          {!EventPage && (
            <li className="font-bold text-sm">Red - Everyone can go.</li>
          )}
          {!EventPage && (
            <li className="font-bold text-sm">
              Orange - Second most popular dates.
            </li>
          )}
          {!EventPage && (
            <li className="font-bold text-sm">
              After saving, tap "Change availability" if you need to edit it
              again.
            </li>
          )}
          {!EventPage && (
            <li className="font-bold text-sm">
              Only the event creator can confirm the final date.
            </li>
          )}
          {!EventPage && (
            <li className="font-bold text-sm">
              Once confirmed, you can add the event to Google Calendar.
            </li>
          )}
        </ol>
      </div>
    </div>
  )
}
