export default function CalendarButton({
  scoreMap,
  maxScore,
  participantsCount,
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
  // const dayNotFixed = wrappedDate.getDay()
  // const day = (dayNotFixed + 6) % 7

  // function getDayName(day) {
  //   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //   return daysOfWeek[day]
  // }
  //animate-pulse

  const scoreForDate = scoreMap[propDate] ?? 0
  const maxEqualParticipants = maxScore === participantsCount && maxScore !== 0

  const orangeBorder = maxEqualParticipants
    ? scoreForDate === maxScore - 1 && scoreForDate !== 0
    : scoreForDate === maxScore && scoreForDate !== 0

  return (
    <button
      disabled={isGuest}
      onClick={onToggle}
      key={index}
      className={`hover:opacity-80 text-center text-xs sm:text-sm md:text-lg lg:text-xl transition-all duration-200 ${isSelected ? 'bg-blue-500' : 'bg-gray-400'} text-white p-2 rounded-lg transition-colors duration-250 w-full sm:h-16 md:h-20 lg:h-26 h-10 cursor-pointer ${scoreForDate === participantsCount && scoreForDate !== 0 ? ' border-3 sm:border-5 md:border-6 lg:border-7 border-red-500' : ''} ${orangeBorder ? ' border-3 sm:border-5 md:border-6 lg:border-7 border-yellow-500' : ''}
        
        `} //
    >
      {wrappedDate.getDate()}
    </button>
  )
}
