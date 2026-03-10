import NicknameForm from '../components/NicknameForm'
import AvailabilityGrid from '../components/AvailabilityGrid'
import { useState, useEffect, useMemo } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'
import ParticipantsDropdown from './ParticipantsDropdown'
import HowItWorks from './HowItWorks'
import GuestDropdown from './GuestDropdown'

export default function EventView({ eventData, eventId }) {
  const [nickname, setNickname] = useState(
    localStorage.getItem(`nickname-${eventId}`) || '',
  )
  const [selectedDates, setSelectedDates] = useState({})
  const [participants, setParticipants] = useState([])

  const isGuest = nickname === 'Guest'

  useEffect(() => {
    const preloadAvailability = async () => {
      if (!nickname) return
      try {
        const participantRef = doc(
          db,
          'events',
          eventId,
          'participants',
          nickname.toLowerCase().trim(), //jak cos nie bedzie dzialac to
        )

        const snapshot = await getDoc(participantRef)

        if (snapshot.exists()) {
          const data = snapshot.data()
          setSelectedDates(data.availability || {})
          toast.success('Loaded previous availability')
        } else {
          setSelectedDates({})
        }
      } catch (error) {
        toast.error('Failed to load availability.')
        console.error(error)
      }
    }

    preloadAvailability()
  }, [nickname, eventId])

  useEffect(() => {
    const fetchParticipants = async () => {
      const participantsRef = collection(db, 'events', eventId, 'participants')
      const snapshot = await getDocs(participantsRef)
      const participants = snapshot.docs.map((doc) => doc.data())
      setParticipants(participants)
    }

    fetchParticipants().catch((error) => {
      console.error('Error fetching participants:', error)
    })
  }, [participants.length, eventId])

  const buildScoreMap = (participants) => {
    const score = {}

    participants.forEach((participant) => {
      Object.entries(participant.availability || {}).forEach(
        ([date, value]) => {
          if (value) {
            score[date] = (score[date] || 0) + 1
          }
        },
      )
    })
    return score
  }

  const scoreMap = buildScoreMap(participants)

  const dateParticipantsMap = useMemo(() => {
    const map = {}

    participants.forEach((p) => {
      Object.entries(p.availability || {}).forEach(([date, value]) => {
        if (value) {
          if (!map[date]) map[date] = []

          map[date].push(p.nickname)
        }
      })
    })
    return map
  }, [participants])

  return (
    <div>
      <GuestDropdown
        nickname={nickname}
        setNickname={setNickname}
        eventId={eventId}
      />
      <HowItWorks EventView={true} />
      <ParticipantsDropdown participants={participants} />

      <div
        style={{
          position: 'relative',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1,
        }}
        className="mx-6 sm:mx-0 rounded-bl-4xl rounded-tr-4xl  flex flex-col sm:flex-row items-center align-middle justify-center mt-20 mb-20 md:gap-20 lg:gap-30 shadow-lg shadow-white/50 p-4 sm:p-10 lg:p-16"
      >
        <div className="justify-center align-middle items-center mb-5 sm:mb-0">
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-2 mt-2 pr-2 pl-2 text-blue-500 font-bold">
            Share this link with your friends:<br></br>
          </h2>

          <button
            className="text-sm text-white rounded-2xl px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all duration-250 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success('Link copied to clipboard!')
            }}
          >
            Copy Link
          </button>
        </div>

        <div className="px-5 max-w-88 sm:max-w-200 items-center rounded-2xl flex flex-col gap-4">
          <div className="mt-5 justify-center flex align-middle items-center">
            <span className="text-2xl md:text-2xl lg:text-4xl pr-1">🏷️</span>
            <h2 className="text-2xl font-extrabold md:text-2xl lg:text-4xl pr-2 pl-2 text-blue-500 text-shadow-lg inset-shadow-sm shadow-sm ">
              {eventData.eventName.toUpperCase()}
            </h2>
            <span className="text-2xl md:text-2xl lg:text-4xl pl-1">🏷️</span>
          </div>

          {eventData.eventLocation && (
            <div className="mb-1 justify-center flex align-middle items-center">
              <span className="text-2xl md:text-2xl lg:text-4xl pb-2 pr-1">
                🗺️
              </span>
              <h2 className="text-xl md:text-2xl lg:text-4xl mb-4 mt-2 pr-2 pl-2 text-yellow-300 text-shadow-lg inset-shadow-sm shadow-sm font-bold">
                {eventData.eventLocation.toUpperCase()}
              </h2>
              <span className="text-2xl md:text-2xl lg:text-4xl pb-2 pl-1">
                🗺️
              </span>
            </div>
          )}
        </div>
      </div>
      {nickname === '' ? (
        <NicknameForm eventId={eventId} setNickname={setNickname} />
      ) : (
        <AvailabilityGrid
          dateParticipantsMap={dateParticipantsMap}
          scoreMap={scoreMap}
          participantsCount={participants.length}
          isGuest={isGuest}
          eventData={eventData}
          eventId={eventId}
          nickname={nickname}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      )}
    </div>
  )
}
