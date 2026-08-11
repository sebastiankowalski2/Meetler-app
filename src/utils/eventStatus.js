// An event is "ended" once we're past its end date. Events created before
// the dateStart/dateEnd fields existed (legacy timeRangeDays mode) never
// had a fixed end date, so they're treated as always-open.
export function isEventEnded(eventData) {
  if (!eventData?.dateEnd) return false

  const [year, month, day] = eventData.dateEnd.split('-').map(Number)
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999)

  return new Date() > endOfDay
}
