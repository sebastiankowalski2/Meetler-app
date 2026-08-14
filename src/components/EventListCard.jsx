import { Link } from 'react-router-dom'
import { formatDisplayDate } from '../utils/eventStatus'

export default function EventListCard({
  id,
  data,
  ended,
  badge,
  cornerAction,
  participantCount,
}) {
  return (
    <div
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: ended
          ? 'rgba(255, 255, 255, 0.18)'
          : 'rgba(255, 255, 255, 0.35)',
      }}
      className={`relative rounded-xl px-0 shadow-md transition-shadow duration-200 ${ended ? 'opacity-60 hover:opacity-80' : 'hover:shadow-lg'}`}
    >
      <Link
        to={`/event/${id}`}
        className="flex flex-col items-start gap-1 p-4 pb-8 pr-6 text-left"
      >
        <span className="pb-2 text-xl font-extrabold text-primary pr-6">
          {data.eventName}
        </span>
        {data.eventLocation && (
          <span className="pb-2 text-sm">🏠 {data.eventLocation}</span>
        )}
        <span className="text-xs opacity-70">
          {data.dateStart && data.dateEnd
            ? `${data.dateStart} → ${data.dateEnd}`
            : null}
        </span>
        {(badge || ended || data.confirmedDate) && (
          <span className="flex flex-wrap items-center gap-2 text-xs font-bold text-primary">
            {badge}
            {ended && (
              <span className="rounded-full bg-slate-200 text-slate-600 px-2 py-0.5">
                Ended
              </span>
            )}
            {data.confirmedDate && (
              <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5">
                🏆 {formatDisplayDate(data.confirmedDate)}
              </span>
            )}
          </span>
        )}
      </Link>

      {cornerAction && (
        <button
          disabled={cornerAction.disabled}
          onClick={cornerAction.onClick}
          title={cornerAction.title}
          className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors duration-150 cursor-pointer disabled:opacity-40"
        >
          {cornerAction.icon}
        </button>
      )}

      {typeof participantCount === 'number' && (
        <span
          title={`${participantCount} ${participantCount === 1 ? 'person' : 'people'} joined`}
          className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-bold px-2 py-1"
        >
          👥 {participantCount}
        </span>
      )}
    </div>
  )
}
