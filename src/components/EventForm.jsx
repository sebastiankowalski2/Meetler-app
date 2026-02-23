import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function EventForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    eventName: '',
    eventLocation: '',
    timeRangeDays: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)

    try {
      // Add a new document with a generated ID to the "events" collection in Firestore
      const docRef = await addDoc(collection(db, 'events'), formData)

      console.log('Document written with ID: ', docRef.id)

      // Reset the form
      setFormData({
        eventName: '',
        eventLocation: '',
        timeRangeDays: '',
      })

      // Navigate to the newly created event page using the generated document ID
      navigate(`/event/${docRef.id}`)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center align-middle">
        <div className="form-group w-100 items-center border-10 border-blue-400 bg-blue-200 flex flex-col p-2 pt-4 rounded-3xl gap-2 bos-shadow-lg shadow-blue-950 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="w-75">
              <label htmlFor="eventName">Event Name: </label>
              <input
                className="bg-white mt-2 text-slate-900 p-2 rounded-lg w-full mb-4 active:outline-blue-500 focus:outline-blue-500 transition-colors duration-250"
                type="text"
                placeholder="Birthday Party, Conference, etc."
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
              />

              <label htmlFor="eventLocation">Location: </label>
              <input
                className="bg-white mt-2 text-slate-900 p-2 rounded-lg w-full mb-4 active:outline-blue-500 focus:outline-blue-500 transition-colors duration-250"
                type="text"
                placeholder="Bill's House, Central Park, etc."
                id="eventLocation"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
              />

              <label htmlFor="timeRangeDays">
                Time Range (Days - from now on):{' '}
              </label>
              <input
                className="bg-white mt-2 text-slate-900 p-2 rounded-lg w-full mb-2 active:outline-blue-500 focus:outline-blue-500 transition-colors duration-250"
                type="text"
                placeholder="7, 14, etc."
                id="timeRangeDays"
                name="timeRangeDays"
                value={formData.timeRangeDays}
                onChange={handleChange}
                required
              />
            </div>
            <button
              className="bg-blue-500 text-2xl m-3 text-white cursor-pointer rounded-2xl p-3 hover:bg-blue-600 transition-all duration-250 hover:shadow-sm hover:shadow-blue-950"
              type="submit"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
