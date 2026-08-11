import { useState, useEffect, useRef } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'
import ConfirmDialog from './ConfirmDialog'

export default function ParticipantsDropdown({
  participants,
  eventId,
  isCreator = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingRemoval, setPendingRemoval] = useState(null) // participant or null
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const removeParticipant = async () => {
    if (!pendingRemoval) return
    try {
      await deleteDoc(
        doc(db, 'events', eventId, 'participants', pendingRemoval.uid),
      )
      toast.success(
        `Removed ${pendingRemoval.displayName || 'participant'} from the event.`,
      )
    } catch (error) {
      console.error('Failed to remove participant:', error)
      toast.error('Could not remove this participant.')
    } finally {
      setPendingRemoval(null)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full bg-primary text-white pl-3 pr-1.5 py-1 font-bold text-sm cursor-pointer hover:bg-primary-hover transition-colors duration-150"
      >
        <span className="hidden sm:inline">Participants</span>
        <span className="sm:hidden">🧑</span>
        <span className="bg-amber-300 text-black font-bold px-2 py-0.5 rounded-full text-xs">
          {participants.length}
        </span>
      </button>

      <div
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        className={`absolute right-0 top-full mt-2 w-56 max-h-72 overflow-y-auto p-2 rounded-2xl shadow-xl border border-black/5 origin-top-right transition-all duration-150 z-40 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {participants.length === 0 && (
          <p className="text-sm font-bold text-slate-500 p-2">
            No participants yet
          </p>
        )}
        <ul className="flex flex-col gap-1">
          {participants.map((participant) => (
            <li
              key={participant.uid}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-800 hover:bg-slate-100"
            >
              <span className="truncate">
                {participant.displayName || 'Anonymous'}
              </span>
              {isCreator && (
                <button
                  onClick={() => setPendingRemoval(participant)}
                  title="Remove from event"
                  className="text-slate-400 hover:text-rose-600 cursor-pointer leading-none shrink-0"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ConfirmDialog
        open={!!pendingRemoval}
        title="Remove participant?"
        message={`${pendingRemoval?.displayName || 'This participant'} will be removed from the event and their availability will be deleted.`}
        confirmLabel="Remove"
        onConfirm={removeParticipant}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  )
}
