import React, { useState } from 'react'

export default function EventForm() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventLocation: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)

    // Reset the form
    setFormData({
      eventName: '',
      eventLocation: '',
    })

    // What next:
    // We can replace the console.log with an API call to create the event in the backend. For example, using fetch or axios to send a POST request with the form data to your server.
    // We will also navigate to the newly created event page after submission(EventPage.jsx). For that, we can use the useNavigate hook from react-router-dom.
    // First, import the hook at the top of this file:
    // import { useNavigate } from 'react-router-dom';
    // Then, initialize it inside the component:
    // const navigate = useNavigate();
    // Finally, after successfully creating the event (e.g., after an API call), you can navigate to the event page:
    // For example, if you have a backend that returns the new event ID, you could do:
    // const newEventId = response.data.id; // Assuming your API returns the new event ID
    // navigate(`/event/${newEventId}`);
  }

  return (
    <>
      <div className="flex items-center justify-center align-middle">
        <div className="form-group w-100 items-center border-10 border-blue-400 bg-blue-200 flex flex-col p-2 pt-4 rounded-3xl gap-2">
          <form onSubmit={handleSubmit}>
            <div className="w-75">
              <label htmlFor="eventName">Event Name: </label>
              <input
                className="bg-white mt-2 text-slate-900 p-2 rounded-lg w-full mb-4"
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
              />

              <label htmlFor="eventLocation">Location: </label>
              <input
                className="bg-white mt-2 text-slate-900 p-2 rounded-lg w-full mb-2"
                type="text"
                id="eventLocation"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                required
              />
            </div>
            <button
              className="bg-blue-500 text-2xl m-3 text-white cursor-pointer rounded-2xl p-3 hover:bg-blue-600 transition-colors duration-250"
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
