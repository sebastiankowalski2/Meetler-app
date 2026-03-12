import CalendarButton from './CalendarButton'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

export default function AvailabilityGrid({
  dateParticipantsMap,
  scoreMap,
  participantsCount,
  isGuest,
  eventData,
  eventId,
  nickname,
  selectedDates,
  setSelectedDates,
}) {
  const [firstClick, setFirstClick] = useState(false)

  // zamiana, zamiast timeRangeDays, bedziemy miec po prostu dateStart i dateEnd, zeby moc latwo generowac kalendarz, a nie tylko od dzisiaj do x dni, ale tez np od 1 marca do 30 kwietnia
  //const dateStart = eventData.dateStart
  //const dateEnd = eventData.dateEnd

  //const daysCount = Math.ceil((new Date(dateEnd) - new Date(dateStart)) / (1000 * 60 * 60 * 24)) + 1

  //TODO: zrobic walidacje, zeby timeRangeDays bylo liczba dodatnia i mniejsza niz np 365
  // jak sie niby robi walidacje dat w React? czy to jest po prostu sprawdzanie w handleChange i wyswietlanie errora, albo blokowanie submitu? albo moze uzycie jakiej biblioteki do walidacji formularzy, np Formik czy React Hook Form?
  // ale react to frontend wiec to nie jest dobre robic w ten sposob?
  // chyba najlepiej zrobic walidacje w handleSubmit, zeby nie bylo mozliwosci obejscia jej, a w handleChange tylko sprawdzac i wyswietlac errora, zeby user od razu widzial, ze cos jest nie tak, ale i tak mogl kliknac submit i zobaczyc errora, zeby wiedzial co poprawic.
  const dateStart = eventData.dateStart
  const dateEnd = eventData.dateEnd

  let daysCount =
    eventData.timeRangeDays === undefined
      ? Math.ceil(
          (new Date(dateEnd) - new Date(dateStart)) / (1000 * 60 * 60 * 24),
        ) + 1
      : eventData.timeRangeDays

  daysCount > 365 && (daysCount = 365) // cap at 365 days to prevent performance issues
  daysCount < 1 && (daysCount = 1) // minimum 1 day

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
    setSelectedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }))
    setFirstClick(true)
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
        nickname.trim().toLowerCase(),
      )

      await setDoc(participantRef, {
        nickname: nickname.trim().toLowerCase(),
        availability: selectedDates,
        updatedAt: new Date(),
      })

      toast.success('Availability saved successfully!', {
        style: {
          fontStyle: 'extra-bold',
        },
        iconTheme: {
          primary: 'var(--color-primary)',
        },
      })
      setFirstClick(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to save availability.')
    }
  }

  const scores = Object.values(scoreMap)
  const maxScore = Math.max(...scores, 0)

  return (
    <>
      {!isGuest && (
        <button
          disabled={isGuest || !firstClick}
          onClick={saveAvailability}
          className={`z-50 text-xl sm:text-xl md:text-xl lg:text-2xl sticky mb-4 top-5 bg-primary text-white px-4 py-2 rounded-lg hover:primary-hover transition-colors duration-250 ${firstClick ? 'animate-pulse cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
        >
          Save Availability
        </button>
      )}

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
            style={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            }}
            key={monthKey}
            className="mb-24 w-full p-2 sm:p-4 rounded-lg shadow-lg shadow-gray-800"
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
                    dateParticipantsMap={dateParticipantsMap}
                    scoreMap={scoreMap}
                    maxScore={maxScore}
                    participantsCount={participantsCount}
                    isGuest={isGuest}
                    key={index}
                    propDate={date}
                    index={index}
                    firstClick={firstClick}
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
    </>
  )
}
