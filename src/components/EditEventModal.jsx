import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'
import Modal from './Modal'

export default function EditEventModal({
  open,
  onClose,
  eventId,
  eventData,
  datesLocked = false,
}) {
  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    eventName: eventData.eventName || '',
    eventLocation: eventData.eventLocation || '',
    dateStart: eventData.dateStart || today,
    dateEnd: eventData.dateEnd || today,
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.dateEnd < formData.dateStart) {
      toast.error('End date cannot be before start date.')
      return
    }

    setSaving(true)
    try {
      await updateDoc(doc(db, 'events', eventId), {
        eventName: formData.eventName,
        eventLocation: formData.eventLocation,
        dateStart: formData.dateStart,
        dateEnd: formData.dateEnd,
      })
      toast.success('Event updated.')
      onClose()
    } catch (error) {
      console.error('Failed to update event:', error)
      toast.error('Could not update the event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Edit event" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="font-bold text-sm" htmlFor="editEventName">
            Event Name
          </label>
          <input
            className="bg-white border border-primary mt-1 p-2 rounded-lg w-full focus:outline-primary"
            type="text"
            id="editEventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            maxLength={20}
            required
          />
        </div>

        <div>
          <label className="font-bold text-sm" htmlFor="editEventLocation">
            Location
          </label>
          <input
            className="bg-white border border-primary mt-1 p-2 rounded-lg w-full focus:outline-primary"
            type="text"
            id="editEventLocation"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
            maxLength={20}
            required
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 min-w-0">
            <label className="font-bold text-sm" htmlFor="editDateStart">
              Start Date
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-primary bg-white p-2 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              type="date"
              id="editDateStart"
              name="dateStart"
              value={formData.dateStart}
              onChange={handleChange}
              disabled={datesLocked}
              required
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="font-bold text-sm" htmlFor="editDateEnd">
              End Date
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-primary bg-white p-2 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              type="date"
              id="editDateEnd"
              name="dateEnd"
              value={formData.dateEnd}
              onChange={handleChange}
              disabled={datesLocked}
              required
            />
          </div>
        </div>

        {datesLocked && (
          <p className="text-xs opacity-70">
            A final date is confirmed, so the date range is locked. Unconfirm it
            first if you need to change it.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 bg-primary text-white font-bold rounded-2xl p-2.5 hover:bg-primary-hover transition-colors duration-200 cursor-pointer disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </Modal>
  )
}
