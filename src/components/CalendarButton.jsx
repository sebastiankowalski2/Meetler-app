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
  // const dayNotFixed = wrappedDate.getDay()
  // const day = (dayNotFixed + 6) % 7

  // function getDayName(day) {
  //   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //   return daysOfWeek[day]
  // }
  //animate-pulse

  const isHot = -1 //index najbardziej popularnej daty, bedzie przekazywane z AvailabilityGrid.jsx, bedzie to liczba reprezentujaca index daty w posortowanej tablicy dat, gdzie sortowanie bedzie po ilosci zaznaczen danej daty przez uzytkownikow. Najpopularniejsza data bedzie miala index 0, druga najpopularniejsza 1 itd. Jesli data nie jest zaznaczana przez zadnego uzytkownika to bedzie miala index -1. Bedzie to wykorzystywane do nadawania kolorow przyciskom, najbardziej popularna data bedzie czerwona, druga najpopularniejsza zolta, a reszta szara.
  // ^^^^^^^^
  // moze cos takiego

  return (
    <button
      disabled={isGuest}
      onClick={onToggle}
      isHot={isHot} //- bedzie przekazywac czy data jest popularna wsrod uzytkownikow, to znaczy czy jest najwiecej zaznaczana.
      key={index}
      className={`hover:opacity-80 text-center text-xs sm:text-sm md:text-lg lg:text-xl transition-all duration-200 ${isSelected ? 'bg-blue-500' : 'bg-gray-400'} text-white p-2 rounded-lg transition-colors duration-250 w-full sm:h-16 md:h-20 lg:h-26 h-10 cursor-pointer ${index < isHot ? ' border-3 sm:border-5 md:border-6 lg:border-7 border-red-500' : ''} ${index == isHot ? ' border-3 sm:border-5 md:border-6 lg:border-7 border-yellow-500' : ''}`} //statyczne kolory narazie - bedzie zalezne od tego czy data jest popularna wsrod uzytkownikow, to znaczy czy jest najwiecej zaznaczana. zaznaczona przez wszystkich bedzie czerwona, zaznaczona przez wiekszosc ale nie wszyskich bdzie zolta.
    >
      {wrappedDate.getDate()}
    </button>
  )
}
