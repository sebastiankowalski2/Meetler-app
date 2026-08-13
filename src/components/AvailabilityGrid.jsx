import CalendarButton from './CalendarButton'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import LoginRequired from './LoginRequired'

export default function AvailabilityGrid({
  dateParticipantsMap,
  scoreMap,
  participantsCount,
  isGuest,
  eventEnded = false,
  eventData,
  eventId,
  selectedDates,
  setSelectedDates,
  isCreator = false,
  confirmedDate = null,
  onConfirmDate,
  hadSavedAvailability = false,
}) {
  const [firstClick, setFirstClick] = useState(false)
  // "justSaved" flips true right after a successful save this session;
  // "manuallyUnlocked" flips true when the person clicks "Change
  // availability". Together with the hadSavedAvailability prop (from an
  // earlier visit) this derives whether the grid should be locked, without
  // needing an effect to sync state from a prop.
  const [justSaved, setJustSaved] = useState(false)
  const [manuallyUnlocked, setManuallyUnlocked] = useState(false)
  const locked = (hadSavedAvailability || justSaved) && !manuallyUnlocked
  const { user, authLoading } = useAuth()

  // Parse YYYY-MM-DD into a local Date to avoid timezone shifts.
  const parseDateString = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const dateStart = eventData.dateStart
  const dateEnd = eventData.dateEnd
  const usesDateRange =
    eventData.timeRangeDays === undefined && dateStart && dateEnd

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const eventStartDate = usesDateRange ? parseDateString(dateStart) : null
  const eventEndDate = usesDateRange ? parseDateString(dateEnd) : null
  const effectiveStartDate =
    usesDateRange && eventStartDate < today ? today : eventStartDate

  let daysCount = usesDateRange
    ? Math.ceil((eventEndDate - effectiveStartDate) / (1000 * 60 * 60 * 24)) + 1
    : eventData.timeRangeDays

  daysCount > 365 && (daysCount = 365)
  daysCount < 1 && (daysCount = 1)

  // Generate dates from explicit event range, fallback to legacy "today + N days" mode.
  const generateDates = (daysCount, startDate) => {
    const dates = []
    const baseDate = startDate ? new Date(startDate) : new Date()
    baseDate.setHours(0, 0, 0, 0)

    // Tu ewenualnie <= zeby bylo +1 dzien
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + i)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      dates.push(`${year}-${month}-${day}`)
    }
    return dates
  }

  const dates = generateDates(
    daysCount,
    usesDateRange ? effectiveStartDate : null,
  )

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

  const saveAvailability = async () => {
    if (!user) return

    try {
      const participantRef = doc(
        db,
        'events',
        eventId,
        'participants',
        user.uid,
      )

      await setDoc(participantRef, {
        uid: user.uid,
        displayName: user.displayName || user.email || 'Anonymous',
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
      setJustSaved(true)
      setManuallyUnlocked(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to save availability.')
    }
  }

  const unlockForEditing = () => {
    setManuallyUnlocked(true)
    setFirstClick(false)
  }

  const scores = Object.values(scoreMap)
  const maxScore = Math.max(...scores, 0)

  const topDates = Object.entries(scoreMap)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)

  const formatDate = (dateString) =>
    parseDateString(dateString).toLocaleDateString('en-EN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

  return (
    <>
      {participantsCount > 1 &&
        isCreator &&
        !eventEnded &&
        !confirmedDate &&
        topDates.length > 0 && (
          <div className="flex flex-col items-center justify-center mb-6">
            <div
              style={{
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
              }}
              className="mb-6 w-full max-w-md rounded-2xl shadow-md p-4"
            >
              <h3 className="font-display font-extrabold text-primary mb-1">
                🏆 Pick the final date
              </h3>
              <p className="text-xs opacity-70 mb-2">
                🔒 Only you can see this - you're the event creator.
              </p>
              <ul className="flex flex-col gap-1.5">
                {topDates.map(([date, score]) => (
                  <li
                    key={date}
                    className="flex items-center justify-between gap-2 rounded-lg bg-white/50 px-3 py-2 text-sm font-bold"
                  >
                    <span>
                      {formatDate(date)} -{' '}
                      <span
                        className={
                          participantsCount - score > 0
                            ? 'inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 font-bold text-red-600 ring-1 ring-red-200 shadow-sm'
                            : 'inline-flex items-center rounded-full bg-amber-100/90 px-1.5 py-0.5 font-bold text-yellow-600 ring-1 ring-amber-300 shadow-sm'
                        }
                      >
                        {score}/{participantsCount}
                      </span>{' '}
                      available
                    </span>
                    <button
                      onClick={() => onConfirmDate?.(date)}
                      className={
                        participantsCount - score > 0
                          ? 'rounded-lg bg-primary text-white text-xs font-bold px-2.5 py-1.5 hover:bg-primary-hover transition-colors duration-150 cursor-pointer'
                          : 'rounded-lg bg-yellow-500 text-white text-xs font-bold px-2.5 py-1.5 hover:bg-yellow-600 transition-colors duration-150 cursor-pointer'
                      }
                    >
                      Confirm
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {authLoading ? (
        <p className="mb-4 font-bold opacity-70">Checking your session…</p>
      ) : confirmedDate ? (
        <p className="mb-6 font-bold text-amber-900 bg-amber-50 border border-amber-200 backdrop-blur-md rounded-xl px-4 py-3 inline-block">
          🏆 Final date confirmed - availability is locked.
        </p>
      ) : eventEnded ? (
        <p className="mb-6 font-bold text-slate-600 bg-white/40 backdrop-blur-md rounded-xl px-4 py-3 inline-block">
          This event has ended, so availability can no longer be edited.
        </p>
      ) : isGuest ? (
        <div className="mb-6">
          <LoginRequired message="Aby zaznaczyć swoją dostępność, zaloguj się przez Google. Możesz na razie przeglądać kalendarz." />
        </div>
      ) : locked ? (
        <button
          onClick={unlockForEditing}
          className="z-50 text-md sm:text-xl md:text-xl lg:text-2xl sticky mb-4 top-5 bg-white text-primary border-2 border-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors duration-250 cursor-pointer"
        >
          ✏️ Change availability
        </button>
      ) : (
        <button
          disabled={!firstClick}
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
            className="sm:mb-10 mb-6 w-full p-2 sm:p-4 rounded-lg shadow-lg shadow-gray-800 availabilityGrid"
          >
            <h2 className="text-xl font-bold capitalize sm:pb-4">
              {monthName}
            </h2>
            <div className="grid grid-cols-7 gap-1 md:gap-2 mt-2 md:mt-4 md:pb-2">
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
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 md:mt-4 mt-2">
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
                    isGuest={isGuest || locked}
                    isLocked={!!confirmedDate}
                    isConfirmed={confirmedDate === date}
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
