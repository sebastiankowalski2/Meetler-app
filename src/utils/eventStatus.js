// An event is "ended" once we're past its end date. Events created before
// the dateStart/dateEnd fields existed (legacy timeRangeDays mode) never
// had a fixed end date, so they're treated as always-open.
export function isEventEnded(eventData) {
  if (!eventData?.dateEnd) return false

  const [year, month, day] = eventData.dateEnd.split('-').map(Number)
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999)

  return new Date() > endOfDay
}

// Formats a Date as a local YYYY-MM-DD string. Deliberately NOT
// `date.toISOString().split('T')[0]` - that converts to UTC first, which
// silently shifts to the wrong calendar day for part of the day in any
// timezone ahead of UTC (e.g. Poland, UTC+1/+2). Every "what's today's
// date" computation in this app should go through this helper so date
// math stays internally consistent.
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Turns a "YYYY-MM-DD" string into a friendly display string, e.g. "Aug 15".
// Parses the parts manually (not `new Date("YYYY-MM-DD")`) since that form
// is parsed as UTC midnight and can display as the wrong day.
export function formatDisplayDate(
  dateString,
  options = { month: 'short', day: 'numeric' },
) {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-EN', options)
}
