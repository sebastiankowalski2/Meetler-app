import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'

export default function CalendarButton({
  dateParticipantsMap,
  scoreMap,
  maxScore,
  participantsCount,
  propDate,
  index,
  isSelected,
  onToggle,
  isGuest,
}) {
  const [hovered, setHovered] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })

  // Accept either a Date or a YYYY-MM-DD string and normalize to local Date.
  const toLocalDate = (value) => {
    if (typeof value === 'string') {
      const [year, month, day] = value.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date(value)
  }

  const wrappedDate = toLocalDate(propDate)

  const scoreForDate = scoreMap[propDate] ?? 0
  const maxEqualParticipants = maxScore === participantsCount && maxScore !== 0

  const orangeBorder = maxEqualParticipants
    ? scoreForDate === maxScore - 1 && scoreForDate !== 0
    : scoreForDate === maxScore && scoreForDate !== 0

  const people = dateParticipantsMap[propDate] || []

  useEffect(() => {
    if (!hovered) return
    const handleScroll = () => setHovered(false)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hovered])

  return (
    <div>
      <button
        //ciekawe do przemyslenia
        style={{
          backdropFilter: 'blur(10px)',
          //backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
        //disabled={isGuest}
        onClick={() => {
          if (!isGuest) onToggle()
        }}
        key={index}
        className={`${isGuest ? 'opacity-50' : 'cursor-pointer hover:opacity-70'} relative bg-transparent border-2 opacity-100 text-center text-xs sm:text-sm md:text-lg lg:text-xl transition-all duration-200 text-black p-2 rounded-lg w-full dateCalendarButton sm:h-16 md:h-20 lg:h-26 h-10  ${scoreForDate === participantsCount && scoreForDate !== 0 ? 'shadow-[0_0_15px_rgba(255,0,0,1),inset_0_0_30px_rgba(255,0,0,1)] sm:shadow-[0_0_15px_rgba(255,0,0,1),inset_0_0_40px_rgba(255,0,0,1)] md:shadow-[0_0_15px_rgba(255,0,0,1),inset_0_0_55px_rgba(255,0,0,1)] lg:shadow-[0_0_25px_rgba(255,0,0,1),inset_0_0_70px_rgba(255,0,0,1)]' : 'border-white'} ${orangeBorder ? 'shadow-[0_0_15px_rgba(255,105,0,1),inset_0_0_30px_rgba(255,130,0,1)] sm:shadow-[0_0_15px_rgba(255,105,0,1),inset_0_0_40px_rgba(255,130,0,1)] md:shadow-[0_0_15px_rgba(255,105,0,1),inset_0_0_55px_rgba(255,130,0,1)] lg:shadow-[0_0_25px_rgba(255,105,0,1),inset_0_0_70px_rgba(255,130,0,1)]' : 'border-white'}
        `}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setTooltipPos({ top: rect.bottom + 5, left: rect.left })
          setHovered(true)
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className={`transition-all duration-200 ${isSelected ? 'bg-primary text-white rounded-full px-1 py-0.5' : 'bg-transparent'} ${wrappedDate.getDate() < 10 ? 'px-1.5 sm:px-2 md:px-2.5' : ''} font-bold`}
        >
          {wrappedDate.getDate()}
        </span>
        <span className="btn absolute z-50 right-1 bottom-1 bg-amber-300 sm:text-sm text-black font-bold px-1 rounded-full leading-none">
          {scoreForDate}
        </span>
        {hovered &&
          createPortal(
            <div
              style={{
                position: 'fixed',
                top: tooltipPos.top,
                left: tooltipPos.left,
              }}
              className={`text-white bg-black text-xs p-2 `}
            >
              {people.length > 0 ? (
                <div>
                  <p className="font-bold mb-1">Available:</p>
                  <ul>
                    {people.map((person, i) => (
                      <li key={i}>{person}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No available participants</p>
              )}
            </div>,
            document.body,
          )}
      </button>
    </div>
  )
}
