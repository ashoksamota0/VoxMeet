# VoxMeet 🎥

**Real-Time Video Calling Platform**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat&logo=razorpay&logoColor=white)

VoxMeet is a full-stack real-time video conferencing platform — create and join meetings with live video/audio, screen sharing, real-time chat, participant management, and persistent meeting history.

## 🚀 Live Demo

- **App:** https://voxmeet-video.vercel.app
- **Backend API:** https://voxmeet-j3xe.onrender.com

> Backend runs on Render's free tier, so the first request after inactivity can take a few seconds while the server wakes up.

## ✨ Key Features

> 👉 **Each category below is expandable — click on one to see its full feature list.**

<details>
<summary><strong>🎥 Real-Time Meetings</strong> &nbsp;<kbd>View details</kbd></summary>

- Real-time video and audio meetings using WebRTC
- Peer-to-peer media communication with WebRTC
- Dynamic participant management for users joining and leaving meetings
- Unique meeting ID generation with duplicate checking and database-level uniqueness
- Shared meeting duration timer based on the meeting's actual creation time
- Connection quality indicator showing Good, Fair, or Poor connection status
- Network connectivity detection using browser online/offline status and WebRTC connection states

</details>

<details>
<summary><strong>🎤 Audio & Video Controls</strong> &nbsp;<kbd>View details</kbd></summary>

- Microphone controls with mute/unmute functionality
- Camera controls with video on/off functionality
- Browser permission handling for camera and microphone
- Device availability detection when a microphone or camera is unavailable
- Visual device status indicators when camera/microphone access is unavailable or permission is denied

</details>

<details>
<summary><strong>🖥️ Screen Sharing</strong> &nbsp;<kbd>View details</kbd></summary>

- Browser-based screen sharing using the Screen Capture API
- Camera-to-screen track switching during screen sharing
- Microphone audio continues while sharing the screen
- Screen sharing visible to remote participants
- Automatic screen-share handling when the browser stops screen sharing

</details>

<details>
<summary><strong>💬 Real-Time Communication</strong> &nbsp;<kbd>View details</kbd></summary>

- Real-time meeting chat using Socket.io
- Unread message count when the chat panel is closed
- Participant list with participant information and media status
- Real-time meeting events for joining, leaving, audio/video changes, and screen sharing
- Socket.io-based WebRTC signaling for offer, answer, and ICE candidate exchange

</details>

<details>
<summary><strong>📋 Meeting Management</strong> &nbsp;<kbd>View details</kbd></summary>

- Persistent meeting history
- Participant records stored in PostgreSQL
- Meeting chat messages persisted in PostgreSQL
- Meeting status management including active and ended meetings
- End meeting for all participants functionality
- Leave meeting functionality
- Protected meeting routes for authenticated users

</details>

<details>
<summary><strong>🔐 Authentication & User Management</strong> &nbsp;<kbd>View details</kbd></summary>

- Secure authentication with Clerk
- Protected API routes using authentication middleware
- Clerk webhook integration to synchronize users with PostgreSQL
- Application-specific user data stored in PostgreSQL
- Authenticated meeting and user operations

</details>

<details>
<summary><strong>💳 Plans & Payments</strong> &nbsp;<kbd>View details</kbd></summary>

- Free plan with 150 meetings per month and up to 10 participants
- Premium plan with unlimited meetings and up to 100 participants
- Razorpay integration for Premium upgrades
- Server-side Razorpay payment signature verification
- Plan-based meeting limits enforced by the backend

</details>

<details>
<summary><strong>📱 UI & User Experience</strong> &nbsp;<kbd>View details</kbd></summary>

- Responsive interface for desktop, tablet, and mobile
- Custom VoxMeet branding and UI
- Responsive navigation with mobile menu
- Chat and participant side panels
- FAQ and public information pages
- Privacy Policy page
- Loading states and user feedback notifications

</details>

<details>
<summary><strong>🗄️ Backend & Data</strong> &nbsp;<kbd>View details</kbd></summary>

- PostgreSQL database for persistent application data
- Relational data model with foreign-key relationships
- Separate storage for users, meetings, participants, and messages
- Database constraints including unique meeting IDs and foreign keys
- Neon PostgreSQL for cloud database hosting

</details>

## 🛠️ Tech Stack

**Frontend:** React · Vite · Tailwind CSS · React Router · Axios · Socket.io Client · Clerk React · Lucide React

**Backend:** Node.js · Express.js · Socket.io · PostgreSQL (Neon) · Clerk Express · Razorpay

**Real-Time Communication:** WebRTC · Socket.io · MediaDevices API · Screen Capture API

**Deployment:** Vercel (frontend) · Render (backend) · Neon (database) · Clerk (auth) · Razorpay (payments)

## 🏗️ Architecture

```
Browser (React + Vite)
   │
   ├── REST API ─────────► Express Backend ────► PostgreSQL (Neon)
   ├── Clerk Auth ───────► Express Backend
   └── Socket.io ────────► Signaling ──► WebRTC Media (P2P) ──► Other Participants
```

## ⚙️ Getting Started

### Prerequisites
- Node.js & npm
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- A Clerk account (for auth keys)
- A Razorpay account (for payment keys)

### 1. Clone the repo
```bash
git clone https://github.com/ashoksamota0/VoxMeet.git
cd VoxMeet
```

### 2. Backend setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```
DATABASE_URL=your_postgres_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
Run it:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
```
Create a `.env` file in `client/`:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```
Run it:
```bash
npm run dev
```

App will be live at `http://localhost:5173`.

*(Match the `.env` keys and scripts above to whatever's actually in your `package.json` / config files if they differ.)*

## 💳 Free & Premium Plans

| Feature | Free | Premium |
|---|---|---|
| Price | ₹0 / forever | ₹499 (one-time) |
| Meetings | 150 / month | Unlimited |
| Participants | Up to 10 | Up to 100 |
| Video & Audio | ✓ | ✓ |
| Screen Sharing | ✓ | ✓ |
| Real-time Chat | ✓ | ✓ |
| Meeting History | ✓ | ✓ |

## 📁 Project Structure

```
VoxMeet/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── config/
└── server/          # Node.js + Express backend
    ├── config/
    ├── controllers/
    ├── middleware/
    └── routes/
```

## 👤 Author

**Ashok Kumar** — Full-Stack Web Developer

- GitHub: [@ashoksamota0](https://github.com/ashoksamota0)
- LinkedIn: [ashok~kumar](https://www.linkedin.com/in/ashok~kumar/)

## 📄 License

This project is intended for portfolio and educational purposes.
