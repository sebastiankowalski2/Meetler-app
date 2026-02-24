import { useState } from 'react'

export default function CalendarButton({ propDate, index }) {
  const [isSelected, setIsSelected] = useState(false)

  //   const parts = propDate.split('-') // ["07", "03", "2026"]
  //   const isoDateString = `${parts[2]}-${parts[1]}-${parts[0]}`

  const wrappedDate = new Date(propDate)
  const dayNotFixed = wrappedDate.getDay()
  const day = (dayNotFixed + 6) % 7

  function getDayName(day) {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return daysOfWeek[day]
  }

  return (
    <button
      onClick={() => {
        setIsSelected(!isSelected)
      }}
      key={index}
      className={`text-center text-xs ${isSelected ? 'bg-blue-500' : 'bg-gray-400'} text-white p-2 rounded-lg mt-4 transition-colors duration-250 w-20 h-19 cursor-pointer`}
    >
      {wrappedDate.getDate()}-{wrappedDate.getMonth() + 1}-
      {wrappedDate.getFullYear()}
      <br></br>
      {getDayName(day)}
    </button>
  )
}
