import { useState } from 'react'

export default function ParticipantsDropdown({ participants }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 460)

  window.addEventListener('resize', () => {
    setIsMobile(window.innerWidth < 460)
  })

  return (
    <div className="absolute top-2 right-2 flex flex-col items-end">
      <button className="z-21 relative" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-bold text-white bg-primary rounded-sm p-1 cursor-pointer">
          {isMobile ? '👤' : 'Participants:'}{' '}
          <span className="bg-amber-300 text-black font-bold px-2 rounded-full">
            {participants.length}
          </span>
        </h3>
      </button>

      <ul
        style={{
          backdropFilter: 'blur(10px)',
          //backgroundColor: 'rgba(255, 255, 255, 0.5)',
          position: 'relative',
          zIndex: 20,
        }}
        className={`shadow-[0_0_10px_rgb(var(--color-primary-rgb)),inset_0_0_40px_rgb(var(--color-secondary-rgb))] border-2 border-primary z-50 text-md font-bold text-black w-full duration-200 origin-top -mt-4.5 ${isOpen ? 'opacity-100 scale-100 translate-y-4' : 'translate-y-0 opacity-0 scale-95 pointer-events-none'}`}
      >
        {participants.map((participant) => (
          <li
            className="py-0.5 border border-primary"
            key={participant.nickname}
          >
            {participant.nickname.slice(0, 1).toUpperCase() +
              participant.nickname.slice(1).toLowerCase()}
          </li>
        ))}
        {participants.length === 0 && (
          <li className="py-0.5 border border-primary" key="no-participants">
            {isMobile ? '---' : 'No participants'}
          </li>
        )}
      </ul>
    </div>
  )
}
