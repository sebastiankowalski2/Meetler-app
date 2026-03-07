import { useState } from 'react'

export default function ParticipantsDropdown({ participants }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-2 right-2 participants-dropdown">
      <button className="z-2 relative" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-bold text-white bg-blue-500 rounded-sm p-1 cursor-pointer">
          Participants:{' '}
          <span className="bg-amber-300 text-black font-bold px-2 rounded-full">
            {participants.length}
          </span>
        </h3>
      </button>

      <ul
        className={`border-2 border-blue-500 z-4 text-md font-bold text-black bg-amber-300 dropdown-list w-full duration-200 origin-top -mt-4.5 ${isOpen ? 'opacity-100 scale-100 translate-y-4' : 'translate-y-0 opacity-0 scale-95 pointer-events-none'}`}
      >
        {participants.map((participant) => (
          <li className="border border-blue-500" key={participant.nickname}>
            {participant.nickname.slice(0, 1).toUpperCase() +
              participant.nickname.slice(1).toLowerCase()}
          </li>
        ))}
      </ul>
    </div>
  )
}
