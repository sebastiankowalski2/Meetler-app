import React from 'react'
import CalendarButton from './CalendarButton'

export default function AvailabilityGrid({ nickname, eventData }) {
  const daysCount = eventData.timeRangeDays

  const generateDates = (daysCount) => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // // Format the date as "DD-MM-YYYY"
      // const formattedDate =
      //   date.getDate().toString().padStart(2, '0') +
      //   '-' +
      //   (date.getMonth() + 1).toString().padStart(2, '0') +
      //   '-' +
      //   date.getFullYear()
      dates.push(date)
    }
    return dates
  }

  const dates = generateDates(daysCount)

  // Bierzemy pierwszą datę z zakresu
  // const firstDateParts = dates[0].split('-') // ["23","02","2026"]

  // // Zamieniamy na ISO żeby Date działał poprawnie
  // const firstISO = `${firstDateParts[2]}-${firstDateParts[1]}-${firstDateParts[0]}`

  const firstDateObj = dates[0]

  // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  const firstDay = firstDateObj.getDay()

  // Zamieniamy żeby tydzień zaczynał się od poniedziałku
  const mondayIndex = (firstDay + 6) % 7

  return (
    <div>
      <h1>Availability Grid</h1>
      <p>Nickname: {nickname}</p>
      <p>Event Data: {JSON.stringify(eventData)}</p>

      <h1>{dates.length} days</h1>

      {/* Date grid table */}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {/* Puste pola */}
        {Array.from({ length: mondayIndex }).map((_, i) => (
          <div key={'empty-' + i}></div>
        ))}
        {dates.map((date, index) => (
          <CalendarButton key={index} propDate={date} index={index} />
        ))}
      </div>
    </div>
  )
}
