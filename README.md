# 🎯 Meetler

## Live Demo

https://meetler.web.app

Meetler is a modern, intuitive web app to easily coordinate group events. Wondering how it works?

1. Create an event and select a date range
2. Pick the days that suit you
3. Share the link with friends
4. See common available days highlighted

A modern, intuitive web application for coordinating event availability with friends and colleagues. Meetler simplifies the process of finding the best time for everyone to meet by allowing participants to mark their availability on an interactive calendar.

## 🖼️ Preview

![Meetler Screenshot](https://i.imgur.com/fAfdkOq.png)

## ✨ Features

- **Event Creation** - Create events with name, location and start date + end date to set the Range of the meeting
- **Validation for Date Inputs** - Prevents selecting past dates and invalid ranges
- **Interactive Availability Grid** - Toggle available dates and save to Firestore
- **Real-time Participants Sync** - Live updates using Firestore `onSnapshot`
- **Availability Persistence** - Previously saved availability auto-loads after name set
- **Participant Insights** - See participants names and participants count, names per date, and per-day score badges
- **Smart Date Highlighting** -
  - Red glow: Everyone is available on that date
  - Orange glow: Best alternative date
- **Guest Mode** - View-only access without editing
- **Quick Share Link** - Copy the event URL in one click
- **Responsive Layout** - Optimized for desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Data Storage**: Firebase Firestore
- **Notifications**: React Hot Toast
- **Code Quality**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v20 or higher)
- npm or yarn

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sebastiankowalski2/Meetler-app.git
   cd Meetler
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Set up Firestore Database
   - Generate a Web API key and configuration
   - Create or update `src/firebase.js` with your configuration:

     ```javascript
     import { initializeApp } from 'firebase/app'
     import { getFirestore } from 'firebase/firestore'

     const firebaseConfig = {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       storageBucket: 'YOUR_STORAGE_BUCKET',
       messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
       appId: 'YOUR_APP_ID',
     }

     const app = initializeApp(firebaseConfig)
     export const db = getFirestore(app)
     ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📖 Usage

### Creating an Event

1. Navigate to the home page
2. Fill in the event details:
   - **Event Name**: Enter the name of your event
   - **Location**: Specify where the event will take place
   - **Start Date**: Choose when availability tracking starts
   - **End Date**: Choose when availability tracking ends
3. Click "Create Event"
4. Share the generated link with participants

### Marking Your Availability

1. Enter your nickname (or click "Guest" to view as a guest)
2. Click on dates in the calendar to mark your availability
3. Selected dates will turn blue
4. Click "Save Availability" to record your choices
5. Return later to auto-load your saved availability

### Reading the Calendar

- **Grey dates**: Not selected by you
- **Blue dates**: Selected by you
- **Score badge (number)**: How many participants are available on that date
- **Red glow**: All participants are available
- **Orange glow**: Best alternative date
- **Hover tooltip**: Shows nicknames of available participants for a date

## 📁 Project Structure

```
Meetler/
├── src/
│   ├── components/
│   │   ├── AvailabilityGrid.jsx      # Calendar grid component
│   │   ├── CalendarButton.jsx        # Individual date button
│   │   ├── EventForm.jsx             # Event creation form
│   │   ├── EventView.jsx             # Main event view
│   │   ├── GuestDropdown.jsx         # Current user menu + logout
│   │   ├── HowItWorks.jsx            # Usage/help panel
│   │   ├── NicknameForm.jsx          # Nickname/guest form
│   │   └── ParticipantsDropdown.jsx  # Participants list dropdown
│   ├── pages/
│   │   ├── CreateEventPage.jsx       # Event creation page
│   │   └── EventPage.jsx             # Event detail page
│   ├── App.jsx                       # Main app component
│   ├── App.css                       # Global styles
│   ├── index.css                     # Tailwind setup
│   ├── main.jsx                      # Entry point
│   └── firebase.js                   # Firebase configuration
├── public/                           # Static assets
├── index.html                        # HTML template
├── package.json                      # Project dependencies
├── vite.config.js                    # Vite configuration
├── eslint.config.js                  # ESLint configuration
└── firebase.json                     # Firebase configuration
```

## 🔧 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build optimized production bundle
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality

## 📝 License

MIT
