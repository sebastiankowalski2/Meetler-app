# 🎯 Meetler

> **Find a date that works for everyone.**

Meetler is a real-time web application for coordinating events with groups of people. Instead of trying to find a common date through endless messages, participants mark their availability on an interactive calendar and Meetler automatically highlights the dates that work best.

The application also supports **groups**, allowing users to organize recurring events with the same people, manage memberships and create events directly inside a group.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-meetler.web.app-4285F4?style=flat&logo=firebase&logoColor=white)](https://meetler.web.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

🌐 **Live application:** https://meetler.web.app  
💻 **Repository:** https://github.com/sebastiankowalski2/Meetler-app

---

## 📸 Preview

![Meetler Preview](https://i.imgur.com/fAfdkOq.png)

---

## ✨ Overview

Meetler focuses on one simple problem:

> **Finding a date that works for a group of people without endless messaging.**

The application provides a simple workflow:

**Create an event → Share the link → Everyone marks availability → Find the best date → Confirm it → Meet**

Meetler supports both authenticated and guest users, while Firebase Authentication and Firestore Security Rules handle identity and authorization.

The project is built as a **React SPA** and deployed using **Firebase Hosting**.

---

## 🚀 Features

### 📅 Event scheduling

- Create events with:
  - event name
  - location
  - date range
- Interactive availability calendar.
- Participants can select the days they are available.
- Previously saved availability is automatically restored.
- Availability can be updated while the event is active.
- Real-time participant synchronization using Firestore `onSnapshot`.
- Per-day availability counters.
- Participant names available for individual dates.
- Automatic identification of the best available dates.
- Visual distinction between:
  - best date
  - alternative dates
  - confirmed date
  - unavailable/ended dates
- Copy event links directly from the event page.
- Responsive interface for desktop, tablet and mobile.

### 🏆 Final date confirmation

Once enough participants have responded, the event creator can confirm the final date.

After confirmation:

- the selected date is clearly highlighted,
- the event's date selection becomes locked,
- participants can add the confirmed date to Google Calendar,
- the creator can reopen the event and change the final date if necessary.

Confirmed dates use a dedicated visual state to make the final decision immediately recognizable.

### ✏️ Event management

Event creators can:

- edit event information,
- change the event name,
- change the location,
- modify the date range while it is still editable,
- confirm or change the final date,
- remove participants,
- delete the event.

The event creator is identified throughout the UI.

### ⏳ Event lifecycle

Meetler distinguishes between active and ended events.

Ended events:

- remain accessible,
- are displayed separately in **My Meetler**,
- are visually de-emphasized,
- no longer allow availability changes,
- can still be viewed by participants.

This allows users to keep a history of previous events instead of losing them after the event date has passed.

---

## 👥 Groups

Groups are designed for people who repeatedly organize events with the same group of participants.

### Group functionality

Users can:

- create groups,
- join groups using a shareable invite link,
- view group members,
- create events inside a group,
- view events associated with a group,
- leave a group,
- manage group membership if they are the owner.

### 👑 Group ownership

Each group has an owner.

The owner can:

- remove members,
- rename the group,
- change the group picture,
- delete the group.

The application keeps group management separate from event ownership, allowing existing events to remain available even if a group is deleted.

### 🖼️ Group pictures

Group owners can upload a custom group image.

The image flow includes:

- local image selection,
- image preview,
- image cropping,
- image resizing,
- saving the resulting image.

Meetler uses `react-easy-crop` for the interactive cropping experience.

If a group does not have a custom picture, the application falls back to a generated avatar based on the group name.

---

## 🔗 Group invitations

Groups have dedicated invite URLs:

```text
/group/{groupId}/join
```

A user opening an invite can see:

- group name,
- group picture,
- current member count,
- a clear **Join group** action.

After joining, the user is redirected directly to the group.

---

## 👤 My Meetler

Authenticated users have a central dashboard for their events and groups.

### Events

**My Meetler → Events** includes:

- events created by the user,
- events the user has joined,
- creator / participant role indicators,
- participant counts,
- confirmed dates,
- ended events,
- event sorting by status and date.

The application uses a Firestore `collectionGroup` query to find participant records belonging to the authenticated user.

### Groups

**My Meetler → Groups** includes:

- groups the user belongs to,
- member counts,
- group pictures,
- group ownership information,
- quick access to group pages,
- creating new groups.

Groups are discovered through a Firestore `collectionGroup` query over the `members` subcollections.

---

## 🔐 Authentication

Meetler uses **Google Sign-In through Firebase Authentication**.

There is no custom password system inside Meetler.

Firebase provides the authenticated identity and stable user UID used throughout the application's authorization model.

Authenticated users can also:

- view their Google profile picture,
- change their Meetler display name,
- sign out,
- access their personal events and groups.

The display name is application-level profile information and does not change the user's Google account or Firebase UID.

---

## 👀 Guest access

Event pages are intentionally accessible without authentication.

This allows someone to receive an event link and immediately view the scheduling information without creating an account.

Guest users can:

- open an event link,
- view the calendar,
- see participant availability,
- see the current scheduling status.

Authentication is required for personal actions such as saving availability.

This keeps the main sharing flow frictionless while still protecting user-specific writes.

---

## 📊 Availability system

The core of Meetler is the availability grid.

For every date, the application calculates:

- how many participants are available,
- which participants are available,
- the relative score of the date.

The UI uses this information to highlight the strongest options.

Conceptually:

```text
Participants
     │
     ▼
Availability data
     │
     ▼
Per-date aggregation
     │
     ├── Participant count
     ├── Available participants
     └── Best-date score
     │
     ▼
Interactive calendar
```

This makes it immediately clear which dates are most suitable for the group.

---

## ⚡ Real-time synchronization

Meetler uses Firestore real-time listeners for event participants.

When someone changes their availability, other users viewing the same event can receive the updated participant data without manually refreshing the page.

The event page subscribes to the event's `participants` subcollection using `onSnapshot`.

This makes the scheduling experience collaborative rather than request/refresh based.

---

## 🎨 Themes & UI customization

Meetler includes a client-side theme system.

Currently available themes include:

- 🟢 **Default**
- 🌊 **Ocean**
- 🍊 **Orangie**
- 📄 **Paper**
- 🌑 **Paper Dark**

Themes are implemented using CSS custom properties and `data-theme` attributes rather than duplicating component styles.

The selected theme is persisted in `localStorage`, so it remains active after refreshing or reopening the application.

The theme system is designed so additional themes can be added without changing individual components.

---

## 📅 Google Calendar integration

When an event has a confirmed date, Meetler generates a Google Calendar event URL containing the relevant event information.

The integration does **not** request access to the user's Google Calendar.

Instead, Meetler generates a calendar link and lets Google handle the final event creation.

This keeps the integration simple and avoids requesting unnecessary Google permissions.

---

## 🧭 Application routes

The main application routes are:

```text
/                         Create event
/event/:eventId           Event details
/my-events                Personal events & groups
/group/:groupId           Group details
/group/:groupId/join      Group invitation
```

Routing is handled by **React Router**.

Firebase Hosting rewrites application routes to the SPA entry point so deep links can be opened directly.

---

## 🏗️ Architecture

Meetler follows a lightweight client-side architecture:

```text
                    ┌──────────────────┐
                    │      React       │
                    │      + Vite      │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
       React Router      Auth Context     Theme Context
             │               │                │
             └───────────────┼────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Firebase     │
                    ├──────────────────┤
                    │ Authentication   │
                    │ Firestore        │
                    │ Hosting          │
                    └──────────────────┘
```

### Authentication flow

```text
Google
  ↓
Firebase Authentication
  ↓
Authenticated Firebase UID
  ↓
Firestore authorization
```

### Event data

```text
events/{eventId}
    │
    └── participants/{userUid}
```

### Group data

```text
groups/{groupId}
    │
    └── members/{userUid}
```

This structure keeps event participation and group membership tied directly to the authenticated user's UID.

---

## 🛡️ Security

Security is enforced at the Firestore layer rather than relying solely on frontend checks.

The current Firestore rules enforce, among other things:

- event ownership based on Firebase UID,
- group ownership based on Firebase UID,
- users can only create/update their own participant records,
- users can only create their own group membership,
- users can leave events/groups themselves,
- group owners can remove members,
- event creators can manage their events,
- ownership fields cannot simply be changed during an update,
- collection-group queries for `participants` and `members` are restricted to the authenticated user's UID.

For example, participant documents are tied to the authenticated user:

```text
/events/{eventId}/participants/{userUid}
```

and the rules require the document UID to match:

```text
request.auth.uid
```

This prevents a client from simply changing a UID in the request and writing availability as another user.

### Public vs protected data

Events and participant availability are intentionally readable because the core Meetler experience is based on shareable event links.

Write operations are significantly more restricted and require Firebase authentication where user ownership matters.

The project intentionally avoids global rules such as:

```text
allow read, write: if true;
```

for protected operations.

---

## 🧰 Tech Stack

| Technology                  | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| **React 19**                | UI and application logic                   |
| **Vite 7**                  | Development server and production bundling |
| **React Router 7**          | Client-side routing                        |
| **Tailwind CSS 4**          | Utility-first styling                      |
| **Firebase 12**             | Authentication, Firestore and Hosting      |
| **Firebase Authentication** | Google authentication                      |
| **Cloud Firestore**         | Database and real-time synchronization     |
| **Firebase Hosting**        | Production hosting                         |
| **react-easy-crop**         | Interactive image cropping                 |
| **React Hot Toast**         | User feedback and notifications            |
| **ESLint 9**                | Static analysis                            |
| **Prettier**                | Code formatting                            |

---

## 📁 Project Structure

```text
Meetler-app/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AppHeader.jsx
│   │   ├── AuthControls.jsx
│   │   ├── AvailabilityGrid.jsx
│   │   ├── CalendarButton.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── CreateGroupDialog.jsx
│   │   ├── EditEventModal.jsx
│   │   ├── EventForm.jsx
│   │   ├── EventListCard.jsx
│   │   ├── EventView.jsx
│   │   ├── GroupAvatar.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── ImageCropModal.jsx
│   │   ├── LoginRequired.jsx
│   │   ├── Modal.jsx
│   │   ├── ParticipantsDropdown.jsx
│   │   ├── ScrollToTopButton.jsx
│   │   └── UserMenu.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── authContextObject.js
│   │   ├── ThemeContext.jsx
│   │   ├── themeContextObject.js
│   │   ├── themes.js
│   │   └── useAuth.js
│   │
│   ├── pages/
│   │   ├── CreateEventPage.jsx
│   │   ├── EventPage.jsx
│   │   ├── GroupPage.jsx
│   │   ├── JoinGroupPage.jsx
│   │   └── MyEventsPage.jsx
│   │
│   ├── utils/
│   │   ├── eventStatus.js
│   │   ├── googleCalendar.js
│   │   └── imageResize.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── firebase.json
├── firestore.rules
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## ⚙️ Getting Started

### Requirements

- Node.js 20+
- npm
- Firebase project

### Installation

Clone the repository:

```bash
git clone https://github.com/sebastiankowalski2/Meetler-app.git
cd Meetler-app
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment variables

Create a `.env` file based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

The application reads the Firebase configuration from Vite environment variables.

Do not commit private credentials or local `.env` files.

---

## 🔥 Firebase setup

Create a Firebase project and enable:

- Firebase Authentication
- Google Sign-In provider
- Cloud Firestore
- Firebase Hosting

Deploy Firestore Security Rules from:

```text
firestore.rules
```

The application also relies on Firestore collection-group queries for:

```text
participants.uid
members.uid
```

so the required Firestore indexes must be available for the corresponding queries.

---

## 💻 Development

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 📦 Production build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

---

## 🚀 Deployment

Meetler is deployed using Firebase Hosting.

Build the application:

```bash
npm run build
```

Then deploy:

```bash
firebase deploy
```

Firebase Hosting serves the generated `dist` directory and rewrites application routes to `index.html`.

---

## 🔍 Technical highlights

This project demonstrates several practical frontend and backend concepts.

### React

- Component-based architecture
- React Context for global authentication and theme state
- Hooks and side effects
- Controlled forms
- Reusable UI components
- Client-side routing
- Responsive layouts
- Persistent client-side preferences

### Firebase

- Google OAuth authentication
- Firestore CRUD operations
- Real-time listeners with `onSnapshot`
- Collection-group queries
- Server timestamps
- Aggregation with `getCountFromServer`
- Firestore Security Rules
- Firebase Hosting

### UX

- Responsive design
- Multiple persistent themes
- Toast notifications
- Loading and error states
- Confirmation dialogs
- Inline editing
- Image cropping and resizing
- Event status handling
- Guest mode
- Shareable deep links
- Google Calendar integration

---

## 🧠 Design decisions

### Why Firebase?

Meetler benefits heavily from real-time collaboration. Firestore provides real-time synchronization without requiring a custom backend, WebSocket server or API layer.

### Why Google Authentication?

Meetler needs a stable identity for personal availability, event ownership and group membership. Firebase Authentication provides this without requiring the application to implement password management.

### Why use UID-based documents?

Participant and member documents use the authenticated user's UID as their document ID.

This creates a direct relationship between:

```text
Firebase Auth
      ↓
request.auth.uid
      ↓
Firestore document
```

and simplifies both application logic and authorization rules.

### Why keep events shareable?

The primary goal of Meetler is frictionless coordination. A participant should be able to open an event link and understand the event immediately without first creating an account.

### Why a client-side architecture?

Meetler does not currently require a dedicated application server. Firebase provides authentication, database access, real-time synchronization and hosting, allowing the project to remain relatively small while still supporting real-time collaborative functionality.

---

## 📈 Future development

Potential areas for further development include:

- richer event sharing previews,
- notifications and reminders,
- additional scheduling options,
- more advanced group permissions,
- improved analytics and observability,
- automated testing,
- stronger automated security testing.

The current architecture is intentionally lightweight so these capabilities can be added without introducing a dedicated backend prematurely.

---

## 👨‍💻 Project

Meetler is a personal full-stack-oriented web project focused on solving a real-world coordination problem with a small, focused architecture.

The project combines:

**React + Vite + Firebase Authentication + Firestore + real-time data + Security Rules + responsive UI**

into a single production-deployed application.

The project demonstrates experience with:

- building a complete application from scratch,
- designing a Firestore data model,
- implementing authentication and authorization,
- handling real-time data,
- building reusable React components,
- managing client-side application state,
- creating responsive interfaces,
- deploying and maintaining a production web application.

---

## 📄 License

This project is licensed under the MIT License.
