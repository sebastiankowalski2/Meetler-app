import React, { useState } from 'react'

export default function NicknameForm({ setNickname }) {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (e) => {
    const { value } = e.target
    setInputValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Nickname submitted:', inputValue)

    setNickname(inputValue)

    setInputValue('')
  }

  const handleGuestSubmit = (e) => {
    e.preventDefault()
    console.log('Guest nickname submitted: Guest')
    // Set the nickname to "Guest" when the guest button is clicked - if user is a Guest, they can only see the availability grid but they cant edit it.
    setNickname('Guest')
  }

  return (
    <>
      <div className="flex items-center justify-center align-middle">
        <div className="form-group w-100 items-center border-10 border-blue-400 bg-blue-200 flex flex-col p-2 pt-4 rounded-3xl gap-2 bos-shadow-lg shadow-blue-950 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="w-75">
              <label htmlFor="nickname">Nickname: </label>
              <input
                className="bg-white mt-2 text-slate-900 p-2 rounded-lg w-full mb-4 active:outline-blue-500 focus:outline-blue-500 transition-colors duration-250"
                type="text"
                placeholder="Enter your nickname"
                id="nickname"
                name="nickname"
                value={inputValue}
                onChange={handleChange}
                required
              />
            </div>
            <button
              className="bg-blue-500 text-2xl m-3 text-white cursor-pointer rounded-2xl p-3 hover:bg-blue-600 transition-all duration-250 hover:shadow-sm hover:shadow-blue-950"
              type="submit"
            >
              Set Nickname
            </button>
            <button
              className="bg-green-500 text-2xl m-3 text-white cursor-pointer rounded-2xl p-3 hover:bg-green-600 transition-all duration-250 hover:shadow-sm hover:shadow-green-950"
              type="submit"
              onClick={handleGuestSubmit}
            >
              Guest(show only)
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
