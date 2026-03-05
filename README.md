# 🎯 Meetler

## Live Demo

https://meetler.web.app

A modern, intuitive web application for coordinating event availability with friends and colleagues. Meetler simplifies the process of finding the best time for everyone to meet by allowing participants to mark their availability on an interactive calendar.

## 🖼️ Preview

![Meetler Screenshot](https://i.imgur.com/SoyER2f.png)

## ✨ Features

- **Event Creation** - Easily create events with name, location, and time range
- **Interactive Calendar Grid** - Visual availability selection with color-coded indicators
- **Real-time Scoring** - See which dates are most popular among participants
- **Guest Support** - Share events with guests who can view but not modify availability
- **Smart Date Highlighting** -
  - Red border: All participants available
  - Yellow/Orange border: Almost everyone available
- **One-Click Link Sharing** - Copy shareable links to distribute to participants
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

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

- Node.js (v16 or higher)
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
   - **Time Range**: Enter the number of days from today to include in the calendar
3. Click "Create Event"
4. Share the generated link with participants

### Marking Your Availability

1. Enter your nickname (or click "Guest" to view as a guest)
2. Click on dates in the calendar to mark your availability
3. Selected dates will turn blue
4. Click "Save Availability" to record your choices

### Reading the Calendar

- **Grey dates**: Not selected by you
- **Blue dates**: Selected by you
- **Red border**: All participants are available
- **Yellow/Orange border**: Almost everyone is available

## 📁 Project Structure

```
Meetler/
├── src/
│   ├── components/
│   │   ├── AvailabilityGrid.jsx      # Calendar grid component
│   │   ├── CalendarButton.jsx        # Individual date button
│   │   ├── EventForm.jsx             # Event creation form
│   │   ├── EventView.jsx             # Main event view
│   │   └── NicknameForm.jsx          # Nickname/participant form
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
