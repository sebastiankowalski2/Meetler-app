import React from 'react'

export default function HowItWorks() {
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-88 p-4 sm:mt-24 mt-10 m-2 bg-gray-100 rounded-md shadow-2xl shadow-black">
          <h1 className="text-2xl font-extrabold mb-4">📌How it works?</h1>
          <ul className="gap-4 text-left">
            <li className="font-bold text-md">1. Create an event.</li>
            <li className="font-bold text-md">
              2. Mark the days when you are available.{' '}
            </li>
            <li className="font-bold text-md">
              3. Share the event link with others.{' '}
            </li>
            <li className="font-bold text-md">
              4. Easily find the best meeting dates.
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
