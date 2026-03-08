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
      //ciekawe do przemyslenia
      style={{
        backdropFilter: 'blur(10px)',
        //backgroundColor: 'rgba(255, 255, 255, 0.5)',
      }}
      disabled={isGuest}
      onClick={onToggle}
      key={index}
      className={`relative bg-transparent border-2 hover:opacity-70 opacity-100 text-center text-xs sm:text-sm md:text-lg lg:text-xl transition-all duration-200 text-black p-2 rounded-lg w-full sm:h-16 md:h-20 lg:h-26 h-10 cursor-pointer ${scoreForDate === participantsCount && scoreForDate !== 0 ? 'shadow-[0_0_15px_rgba(255,0,0,1),inset_0_0_30px_rgba(255,0,0,1)] sm:shadow-[0_0_15px_rgba(255,0,0,1),inset_0_0_40px_rgba(255,0,0,1)] md:shadow-[0_0_15px_rgba(255,0,0,1),inset_0_0_55px_rgba(255,0,0,1)] lg:shadow-[0_0_25px_rgba(255,0,0,1),inset_0_0_70px_rgba(255,0,0,1)]' : 'border-white'} ${orangeBorder ? 'shadow-[0_0_15px_rgba(255,105,0,1),inset_0_0_30px_rgba(255,130,0,1)] sm:shadow-[0_0_15px_rgba(255,105,0,1),inset_0_0_40px_rgba(255,130,0,1)] md:shadow-[0_0_15px_rgba(255,105,0,1),inset_0_0_55px_rgba(255,130,0,1)] lg:shadow-[0_0_25px_rgba(255,105,0,1),inset_0_0_70px_rgba(255,130,0,1)]' : 'border-white'}
        
        `} //
    >
      <span
        className={`transition-all duration-200 ${isSelected ? 'bg-blue-500 rounded-full px-1 py-0.5' : 'bg-transparent'} ${wrappedDate.getDate() < 10 ? 'px-1.5 sm:px-2 md:px-2.5' : ''} font-bold`}
      >
        {wrappedDate.getDate()}
      </span>
      <span className="btn absolute z-50 right-1 bottom-1 bg-amber-300 sm:text-sm text-black font-bold px-1 rounded-full leading-none">
        {scoreForDate}
      </span>
    </button>
  )
}
