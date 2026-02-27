export default function CalendarButton({
  propDate,
  index,
  isSelected,
  onToggle,
  isGuest,
}) {
  // Accept either a Date or a YYYY-MM-DD string and normalize to local Date.
  const toLocalDate = (value) => {
    if (typeof value === 'string') {
      const [year, month, day] = value.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date(value)
  }

  const wrappedDate = toLocalDate(propDate)
  const dayNotFixed = wrappedDate.getDay()
  const day = (dayNotFixed + 6) % 7

  function getDayName(day) {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return daysOfWeek[day]
  }

  return (
    <button
      disabled={isGuest}
      onClick={onToggle}
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
