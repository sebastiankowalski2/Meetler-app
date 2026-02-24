import React from 'react'
import CalendarButton from './CalendarButton'

export default function AvailabilityGrid({ eventData }) {
  const daysCount = eventData.timeRangeDays

  const generateDates = (daysCount) => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      dates.push(date)
    }
    return dates
  }

  const dates = generateDates(daysCount)

  // Function that group dates by month in object
  const groupedDatesByMonth = (dates) => {
    const groups = {}

    dates.forEach((date) => {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`

      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(date)
    })
    return groups
  }

  const groupedDates = groupedDatesByMonth(dates)

  return (
    <>
      <h1 className="mb-8">Availability Grid</h1>

      {Object.entries(groupedDates).map(([monthKey, monthDates]) => {
        // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
        const firstDateObj = monthDates[0].getDay()
        // Week starts on Monday, so we adjust the index: 0=Mon, 1=Tue,
        const mondayIndex = (firstDateObj + 6) % 7

        const monthName = monthDates[0].toLocaleString('en-EN', {
          month: 'long',
          year: 'numeric',
        })

        return (
          <div
            key={monthKey}
            className="mb-8 w-full bg-slate-300 p-4 rounded-lg shadow-lg shadow-gray-800"
          >
            <h2 className="text-xl font-bold capitalize">{monthName}</h2>
            <div>
              {/* Date grid table */}
              <div className="grid grid-cols-7 gap-2 mt-4">
                {/* generate empty cells for days before the first day of the week */}
                {Array.from({ length: mondayIndex }).map((_, i) => (
                  <div key={'empty-' + i}></div>
                ))}
                {monthDates.map((date, index) => (
                  <CalendarButton key={index} propDate={date} index={index} />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
