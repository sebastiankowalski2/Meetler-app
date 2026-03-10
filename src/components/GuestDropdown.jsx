import { useState } from 'react'

export default function ParticipantsDropdown({
  nickname,
  setNickname,
  eventId,
}) {
  const [isOpen, setIsOpen] = useState(false)

  function handleLogout() {
    setNickname('')
    localStorage.removeItem(`nickname-${eventId}`)
  }

  return (
    <div className="absolute top-2 left-2 flex flex-col items-start">
      <button className="z-21 relative" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-bold text-white bg-primary rounded-sm p-1 cursor-pointer">
          Hi,{' '}
          {nickname.trim().charAt(0).toUpperCase() +
            nickname.trim().slice(1).toLowerCase()}
        </h3>
      </button>

      <button
        style={{
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 20,
        }}
        className={`w-full py-0.5 shadow-[0_0_10px_rgb(var(--color-primary-rgb)),inset_0_0_50px_rgb(var(--color-secondary-rgb))] border-2 border-primary z-50 text-md font-bold text-black duration-200 -mt-4.5 origin-top ${isOpen ? 'cursor-pointer opacity-100 scale-100 translate-y-4' : 'translate-y-0 opacity-0 scale-95 pointer-events-none'}`}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}
