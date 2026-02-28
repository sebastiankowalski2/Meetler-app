import CalendarButton from './CalendarButton'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'

export default function AvailabilityGrid({
  isGuest,
  eventData,
  eventId,
  nickname,
  selectedDates,
  setSelectedDates,
}) {
  const daysCount = eventData.timeRangeDays

  // Generate an array of Date objects starting from today, with the length of daysCount
  const generateDates = (daysCount) => {
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    //tu ewenualnie <= zeby bylo +1 dzien
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      dates.push(`${year}-${month}-${day}`)
    }
    return dates
  }

  const dates = generateDates(daysCount)

  // Parse YYYY-MM-DD into a local Date to avoid timezone shifts.
  const parseDateString = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  // Group by month while keeping date strings as keys for readable state.
  const groupedDatesByMonth = (dates) => {
    const groups = {}

    dates.forEach((dateString) => {
      const date = parseDateString(dateString)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`

      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(dateString)
    })
    return groups
  }

  const groupedDates = groupedDatesByMonth(dates)

  const toggleDate = (date) => {
    // Store selection by date string (e.g. 2026-02-26: true/false).
    setSelectedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }))
  }

  //TODO w przyszlosci przerzucic do EventView
  const saveAvailability = async () => {
    if (!nickname || nickname === 'Guest') return

    try {
      const participantRef = doc(
        db,
        'events',
        eventId,
        'participants',
        nickname.toLowerCase(),
      )

      await setDoc(participantRef, {
        nickname: nickname.toLowerCase(),
        availability: selectedDates,
        updatedAt: new Date(),
      })

      toast.success('Availability saved successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save availability.')
    }
  }

  return (
    <>
      <h1 className="mb-8">Availability Grid</h1>

      {Object.entries(groupedDates).map(([monthKey, monthDates]) => {
        // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
        const firstDateObj = parseDateString(monthDates[0]).getDay()
        // Week starts on Monday, so we adjust the index: 0=Mon, 1=Tue,
        const mondayIndex = (firstDateObj + 6) % 7

        const monthName = parseDateString(monthDates[0]).toLocaleString(
          'en-EN',
          {
            month: 'long',
            year: 'numeric',
          },
        )

        return (
          <div
            key={monthKey}
            className="mb-8 w-full bg-slate-300 p-2 sm:p-4 rounded-lg shadow-lg shadow-gray-800"
          >
            <h2 className="text-xl font-bold capitalize">{monthName}</h2>
            <div className="grid grid-cols-7 gap-1 md:gap-2 mt-2 md:mt-4">
              <p>Mon</p>
              <p>Tue</p>
              <p>Wed</p>
              <p>Thu</p>
              <p>Fri</p>
              <p>Sat</p>
              <p>Sun</p>
            </div>
            <div>
              {/* Date grid table */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 mt-4">
                {/* generate empty cells for days before the first day of the week */}
                {Array.from({ length: mondayIndex }).map((_, i) => (
                  <div key={'empty-' + i}></div>
                ))}
                {monthDates.map((date, index) => (
                  <CalendarButton
                    isGuest={isGuest}
                    key={index}
                    propDate={date}
                    index={index}
                    // !! - to convert to boolean, if selectedDates[date] is undefined it will be false, if it's true it will be true
                    isSelected={!!selectedDates[date]}
                    onToggle={() => toggleDate(date)}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {!isGuest && (
        <button
          disabled={isGuest}
          onClick={saveAvailability}
          className={`bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600 transition-colors duration-250 ${isGuest ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          Save Availability
        </button>
      )}
    </>
  )
}
