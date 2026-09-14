# VoxMeet

### Real-Time Video Calling Platform

VoxMeet is a full-stack real-time video conferencing platform that enables users to create and join online meetings with live video/audio communication, screen sharing, real-time chat, participant management, and meeting history.

Built with **React, Node.js, Express, PostgreSQL, WebRTC, Socket.io, Clerk, and Razorpay**.

## 🚀 Live Demo

**Live Application:** https://voxmeet-video.vercel.app

**Backend API:** https://voxmeet-j3xe.onrender.com

> Note: The backend is deployed on Render's free tier, so the first request after inactivity may take some time while the server wakes up.

## ✨ Key Features

- 🎥 Real-time video and audio meetings using WebRTC
- 🖥️ Browser-based screen sharing
- 💬 Real-time meeting chat using Socket.io
- 👥 Dynamic participant management
- 🎤 Microphone and camera controls
- 📋 Persistent meeting history with participant and chat records
- 🔐 Secure authentication with Clerk
- 💳 Free and Premium plans with Razorpay integration
- 📱 Responsive interface for desktop and mobile
- ❓ FAQ and public information pages

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.io Client
- Clerk React
- Lucide React

### Backend
- Node.js
- Express.js
- Socket.io
- PostgreSQL
- Neon
- Clerk Express
- Razorpay

### Real-Time Communication
- WebRTC
- Socket.io
- MediaDevices API
- Screen Capture API

### Deployment
- Vercel — Frontend
- Render — Backend
- Neon — PostgreSQL
- Clerk — Authentication
- Razorpay — Payments

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │      Browser     │
                    │   React + Vite   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
           REST API      Socket.io       Clerk
              │              │          Authentication
              ▼              ▼
      ┌────────────────────────────┐
      │      Node + Express        │
      │          Backend           │
      └────────────┬───────────────┘
                   │
          ┌────────┴─────────┐
          ▼                  ▼
     PostgreSQL         Socket.io
       (Neon)            Signaling
                              │
                              ▼
                         WebRTC Media
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
            Participant A Participant B Participant C



## 🎥 Real-Time Video & Screen Sharing

VoxMeet uses **WebRTC** for peer-to-peer video and audio communication.

Screen sharing is implemented using the browser's `getDisplayMedia()` API. The existing WebRTC video track is replaced with the screen track using `replaceTrack()`, and the camera track is restored when screen sharing stops.

## 💬 Real-Time Chat

**Socket.io** provides real-time communication between meeting participants.

Users can send and receive messages instantly while also seeing sender information, timestamps, and unread message counts.

## 🗄️ Database & Meeting History

VoxMeet uses **PostgreSQL hosted on Neon**.

The application stores:

- **Users** — user information and plan status
- **Meetings** — meeting details, host, status, and timestamps
- **Meeting Participants** — participant activity and join/leave information
- **Meeting Messages** — persistent meeting chat history

This allows users to review previous meeting sessions, participants, and chat messages.

## 🔐 Authentication & Security

Authentication is handled using **Clerk**.

Protected Express APIs verify the authenticated user before allowing access to user-specific resources.

Server-side validation is used for:

- Meeting creation limits
- User plan status
- Host permissions
- Payment verification

Sensitive credentials and API secrets are stored using environment variables and are never exposed to the frontend.

## 💳 Free & Premium Plans

| Feature | Free | Premium |
|---|---|---|
| Price | ₹0 / forever | ₹499 / forever |
| Meetings | 150 / month | Unlimited |
| Participants | Up to 10 | Up to 100 |
| Video & Audio | ✓ | ✓ |
| Screen Sharing | ✓ | ✓ |
| Real-time Chat | ✓ | ✓ |
| Meeting History | ✓ | ✓ |

Premium uses a **one-time Razorpay payment**.

The backend verifies the Razorpay payment signature before activating the Premium plan.

Free-plan meeting limits are enforced on the backend rather than relying only on frontend validation.

## 🧠 Key Implementation Highlights

- **WebRTC + Socket.io:** WebRTC handles real-time media while Socket.io handles signaling and real-time application events.
- **Dynamic Screen Sharing:** Uses WebRTC `replaceTrack()` to switch between camera and screen without creating a separate connection.
- **Server-Side Plan Enforcement:** Meeting limits are validated on the backend based on the user's current plan and usage.
- **Persistent Meeting History:** Meetings, participants, and chat messages are stored in PostgreSQL.
- **Secure Payment Verification:** Razorpay signatures are verified on the backend before Premium access is activated.
- **Custom React Hooks:** `useWebRTC` manages media and peer connections, while `useChat` manages real-time chat functionality.

## 📁 Project Structure

```text
VoxMeet/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── meeting/
│   │   │   └── sessions/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── config/
│   │   ├── App.jsx
│   │   └── index.css
│   └── public/
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    ├── server.js
    └── socket.js


## 🌐 Deployment

VoxMeet is deployed using separate production services:

- **Vercel** — React frontend
- **Render** — Node.js/Express backend
- **Neon** — PostgreSQL database
- **Clerk** — Authentication
- **Razorpay** — Payments

The frontend uses an SPA rewrite configuration so React Router routes work correctly after deployment.

## 📌 Project Highlights

VoxMeet demonstrates practical experience with:

- Full-stack React + Node.js development
- Real-time peer-to-peer communication
- WebRTC media and screen sharing
- Socket.io signaling and real-time events
- PostgreSQL data persistence
- Authentication and protected APIs
- Server-side authorization and usage limits
- Razorpay payment integration
- Responsive UI development
- Production cloud deployment

## 👨‍💻 Author

**Ashok**

Full-Stack Web Developer

Portfolio project demonstrating practical experience with **React, Node.js, Express, PostgreSQL, WebRTC, Socket.io, authentication, REST APIs, payments, and cloud deployment**.

## 📄 License

This project is intended for portfolio and educational purposes.    
