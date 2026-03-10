import { useState } from 'react'

export default function ParticipantsDropdown({ participants }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-2 right-2 participants-dropdown">
      <button className="z-21 relative" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-bold text-white bg-blue-500 rounded-sm p-1 cursor-pointer">
          Participants:{' '}
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
        className={`shadow-[0_0_10px_rgba(0,0,255,1),inset_0_0_50px_rgba(255,200,0,1)] border-2 border-blue-500 z-50 text-md font-bold text-black w-full duration-200 origin-top -mt-4.5 ${isOpen ? 'opacity-100 scale-100 translate-y-4' : 'translate-y-0 opacity-0 scale-95 pointer-events-none'}`}
      >
        {participants.map((participant) => (
          <li
            className="py-0.5 border border-blue-500"
            key={participant.nickname}
          >
            {participant.nickname.slice(0, 1).toUpperCase() +
              participant.nickname.slice(1).toLowerCase()}
          </li>
        ))}
      </ul>
    </div>
  )
}
