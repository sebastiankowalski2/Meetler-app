import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function EventForm({ mClicked }) {
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
      <div
        className={`relative ${mClicked ? '-translate-y-5' : 'translate-y-10'}flex items-center justify-center align-middle duration-200 cursor-pointer"`}
      >
        <div
          className={`form-group sm:w-95 w-88 items-center border-10 border-primary bg-secondary text-black flex flex-col p-2 pt-4 rounded-3xl gap-2 transition-all duration-250 ${mClicked ? 'rotate-3' : ''}`}
        >
          <form onSubmit={handleSubmit}>
            <div className="w-75">
              <label className="font-bold" htmlFor="eventName">
                Event Name: {mClicked ? 'Clicked!' : 'Not clicked'}
              </label>
              <input
                className={`${mClicked ? 'rotate-2' : 'rotate-0'} transition-all duration-250 bg-white mt-2 p-2 rounded-lg w-full mb-4 active:outline-primary focus:outline-primary`}
                type="text"
                placeholder="Birthday Party, Conference, etc."
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
              />
              <div
                className={`${mClicked ? '-rotate-3' : 'rotate-0'} transition-all duration-250`}
              >
                <label className="font-bold" htmlFor="eventLocation">
                  Location:{' '}
                </label>
                <input
                  className={`${mClicked ? '-rotate-1' : 'rotate-0'} bg-white mt-2 p-2 rounded-lg w-full mb-4 active:outline-primary focus:outline-primary transition-all duration-250`}
                  type="text"
                  placeholder="Bill's House, Central Park, etc."
                  id="eventLocation"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div
                className={`${mClicked ? 'rotate-2' : 'rotate-0'} transition-all duration-250`}
              >
                <label className="font-bold" htmlFor="timeRangeDays">
                  Max Range (Days - from now on):{' '}
                </label>
                <input
                  className={`${mClicked ? '-rotate-1' : 'rotate-0'} bg-white mt-2 p-2 rounded-lg w-full mb-2 active:outline-primary focus:outline-primary transition-all duration-250`}
                  type="text"
                  placeholder="7, 14, etc."
                  id="timeRangeDays"
                  name="timeRangeDays"
                  value={formData.timeRangeDays}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              className={`${mClicked ? '-rotate-6' : 'rotate-0'} bg-primary text-2xl m-3 text-white cursor-pointer rounded-2xl p-3 hover:bg-primary-hover transition-all duration-250 hover:shadow-sm hover:shadow-blue-950`}
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
