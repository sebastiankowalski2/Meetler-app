// Google Calendar's "render" endpoint accepts a plain URL with query
// params and opens a pre-filled "create event" page - no API key, no
// OAuth, no backend needed.
export function googleCalendarLink({ eventName, eventLocation, confirmedDate }) {
  if (!confirmedDate) return null

  const [year, month, day] = confirmedDate.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const end = new Date(year, month - 1, day + 1) // all-day events use an exclusive end date

  const toCompact = (d) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventName || 'Meetler event',
    dates: `${toCompact(start)}/${toCompact(end)}`,
    details: 'Planned with Meetler',
  })

  if (eventLocation) params.set('location', eventLocation)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
