import AvailabilityGrid from '../components/AvailabilityGrid'
import { useState, useEffect, useMemo } from 'react'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteField,
} from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import ParticipantsDropdown from './ParticipantsDropdown'
import HowItWorks from './HowItWorks'
import UserMenu from './UserMenu'
import AppHeader from './AppHeader'
import EditEventModal from './EditEventModal'
import { useAuth } from '../context/useAuth'
import { isEventEnded, formatDisplayDate } from '../utils/eventStatus'
import { googleCalendarLink } from '../utils/googleCalendar'

export default function EventView({ eventData, eventId }) {
  const { user, authLoading } = useAuth()
  const [selectedDates, setSelectedDates] = useState({})
  const [participants, setParticipants] = useState([])
  const [hadSavedAvailability, setHadSavedAvailability] = useState(false)

  const eventEnded = isEventEnded(eventData)
  const isCreator =
    !!user && !!eventData?.createdBy && eventData.createdBy === user.uid
  const confirmedDate = eventData?.confirmedDate || null
  const [showEditEvent, setShowEditEvent] = useState(false)

  // A signed-out visitor, or anyone once the event has ended, can only
  // view the event - editing availability is a protected, per-user action.
  const isGuest = !user || eventEnded

  const confirmDate = async (date) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        confirmedDate: date,
        confirmedAt: new Date(),
      })
      toast.success('Final date confirmed! 🏆')
    } catch (error) {
      console.error('Failed to confirm date:', error)
      toast.error('Could not confirm this date.')
    }
  }

  const unconfirmDate = async () => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        confirmedDate: deleteField(),
        confirmedAt: deleteField(),
      })
      toast.success('Confirmation removed. Availability is open again.')
    } catch (error) {
      console.error('Failed to unconfirm date:', error)
      toast.error('Could not undo the confirmation.')
    }
  }

  const handleSelfRemoved = () => {
    setSelectedDates({})
    setHadSavedAvailability(false)
  }

  useEffect(() => {
    if (!eventData?.eventName) return

    const previousTitle = document.title
    document.title = `${eventData.eventName} - Meetler`

    return () => {
      document.title = previousTitle
    }
  }, [eventData?.eventName])

  // Preload this user's previously saved availability, keyed by their
  // stable Firebase uid (never by a self-reported name).
  useEffect(() => {
    let cancelled = false
    const preloadAvailability = async () => {
      if (!user) {
        setSelectedDates({})
        setHadSavedAvailability(false)
        return
      }

      try {
        const participantRef = doc(
          db,
          'events',
          eventId,
          'participants',
          user.uid,
        )

        const snapshot = await getDoc(participantRef)

        if (cancelled) return

        if (snapshot.exists()) {
          const data = snapshot.data()
          setSelectedDates(data.availability || {})
          setHadSavedAvailability(true)
          toast.success('Loaded previous availability', {
            style: {
              fontStyle: 'extra-bold',
            },
            iconTheme: {
              primary: 'var(--color-primary)',
            },
          })
        } else {
          setSelectedDates({})
          setHadSavedAvailability(false)
        }
      } catch (error) {
        if (!cancelled) {
          console.log('Failed to preload availability:', error)
          toast.error('Could not to load previous availability')
          setSelectedDates({})
        }
      }
    }

    preloadAvailability()

    return () => {
      cancelled = true
    }
  }, [user, eventId])

  //realtime fetch
  useEffect(() => {
    const participantsRef = collection(db, 'events', eventId, 'participants')

    let unsubscribe = () => {}

    try {
      unsubscribe = onSnapshot(participantsRef, (snapshot) => {
        const participants = snapshot.docs.map((doc) => doc.data())
        setParticipants(participants)
      })
    } catch (error) {
      console.log('Failed to subscribe to participants:', error)
      toast.error('Could not start realtime updates for participants')
    }
    return () => unsubscribe()
  }, [eventId])

  const { scoreMap, dateParticipantsMap } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const parseDateString = (dateString) => {
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day)
    }

    const score = {}
    const map = {}

    const hasDateRange =
      eventData?.timeRangeDays === undefined &&
      eventData?.dateStart &&
      eventData?.dateEnd

    const eventStartDate = hasDateRange
      ? parseDateString(eventData.dateStart)
      : null
    const eventEndDate = hasDateRange
      ? parseDateString(eventData.dateEnd)
      : null
    const effectiveStartDate =
      hasDateRange && eventStartDate < today ? today : eventStartDate

    participants.forEach((p) => {
      Object.entries(p.availability || {}).forEach(([date, value]) => {
        if (value) {
          const dateObj = parseDateString(date)

          if (Number.isNaN(dateObj.getTime())) return

          const isInVisibleRange = hasDateRange
            ? dateObj >= effectiveStartDate && dateObj <= eventEndDate
            : dateObj >= today

          if (!isInVisibleRange) return

          score[date] = (score[date] || 0) + 1
          if (!map[date]) map[date] = []
          map[date].push(p.displayName || 'Anonymous')
        }
      })
    })
    return { scoreMap: score, dateParticipantsMap: map }
  }, [participants, eventData])

  return (
    <div>
      <AppHeader
        right={
          <>
            <HowItWorks EventView={true} />
            <ParticipantsDropdown
              participants={participants}
              eventId={eventId}
              isCreator={isCreator}
              onSelfRemoved={handleSelfRemoved}
            />
            <UserMenu avatarOnly isCreator={isCreator} />
          </>
        }
      />

      {confirmedDate ? (
        <div className="mx-4 sm:mx-0 mt-6 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 px-5 py-4 flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left">
          <span className="text-2xl">🏆</span>
          <p className="font-bold">
            Final date:{' '}
            {formatDisplayDate(confirmedDate, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <a
            href={googleCalendarLink({
              eventName: eventData.eventName,
              eventLocation: eventData.eventLocation,
              confirmedDate,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-primary text-white text-sm font-bold px-4 py-2 hover:bg-primary-hover transition-colors duration-150"
          >
            📅 Add to Google Calendar
          </a>
          {isCreator && (
            <button
              onClick={unconfirmDate}
              className="text-sm font-bold text-amber-900/70 hover:underline cursor-pointer"
            >
              Change date
            </button>
          )}
        </div>
      ) : (
        eventEnded && (
          <div className="mx-4 sm:mx-0 mt-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 px-5 py-4 flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left">
            <span className="text-2xl">⏳</span>
            <p className="font-bold">
              This event has ended. Want to plan the next one?
            </p>
            <Link
              to="/"
              className="rounded-xl bg-primary text-white text-sm font-bold px-4 py-2 hover:bg-primary-hover transition-colors duration-150"
            >
              Create a new event
            </Link>
          </div>
        )
      )}

      <div
        style={{
          position: 'relative',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1,
        }}
        className="mx-6 sm:mx-0 rounded-bl-4xl rounded-tr-4xl flex flex-col sm:flex-row items-center align-middle justify-center mt-10 mb-20 lg:gap-25 shadow-lg shadow-white/50 p-4 sm:p-10 lg:p-16"
      >
        <div className="justify-center align-middle items-center mb-5 sm:mb-0">
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-2 mt-2 pr-2 pl-2 text-primary font-bold">
            Share this link with your friends:<br></br>
          </h2>

          <button
            className="text-sm text-white rounded-2xl px-4 py-2 bg-primary hover:bg-primary-hover transition-all duration-250 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success('Link copied to clipboard!', {
                style: {
                  fontStyle: 'extra-bold',
                },
                iconTheme: {
                  primary: 'var(--color-primary)',
                },
              })
            }}
          >
            Copy Link
          </button>
        </div>
        <div className="px-5 max-w-88 sm:max-w-200 items-center rounded-2xl flex flex-col gap-4">
          <div className="relative mt-5 flex w-full items-center justify-center gap-2">
            <div className="relative flex items-center justify-center">
              <h2 className="text-2xl font-extrabold md:text-2xl lg:text-3xl pr-2 pl-2 text-primary inset-shadow-sm shadow-sm text-center">
                {eventData.eventName.toUpperCase()}
              </h2>
              {isCreator && !eventEnded && (
                <button
                  onClick={() => setShowEditEvent(true)}
                  title="Edit event"
                  className="absolute right-0 transform translate-x-8 text-lg opacity-60 hover:opacity-100 cursor-pointer"
                >
                  ✏️
                </button>
              )}
            </div>
          </div>

          {eventData.eventLocation && (
            <div className="mb-1 w-full justify-center flex align-middle items-center">
              <span className="text-md md:text-xl lg:text-2xl pb-2 pr-1">
                🏠
              </span>
              <h2 className="text-md md:text-xl lg:text-xl mb-4 mt-2 pr-2 pl-2 text-secondary bg-primary inset-shadow-sm shadow-sm font-bold">
                {eventData.eventLocation.toUpperCase()}
              </h2>
              <span className="text-md md:text-xl lg:text-2xl pb-2 pl-1">
                🏠
              </span>
            </div>
          )}
        </div>
      </div>

      <AvailabilityGrid
        dateParticipantsMap={dateParticipantsMap}
        scoreMap={scoreMap}
        participantsCount={participants.length}
        isGuest={isGuest}
        eventEnded={eventEnded}
        authLoading={authLoading}
        eventData={eventData}
        eventId={eventId}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        isCreator={isCreator}
        confirmedDate={confirmedDate}
        onConfirmDate={confirmDate}
        hadSavedAvailability={hadSavedAvailability}
      />

      {showEditEvent && (
        <EditEventModal
          open={showEditEvent}
          onClose={() => setShowEditEvent(false)}
          eventId={eventId}
          eventData={eventData}
          datesLocked={!!confirmedDate}
        />
      )}
    </div>
  )
}
