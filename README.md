# Exam Proctoring Dashboard

A full-stack AI-powered exam proctoring system with real-time face detection, head pose tracking, and suspicious activity monitoring.

## Project Structure


Exam_Proctoring_Dashboard/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express + Mongoose + Socket.IO
├── .gitignore
└── README.md


## Prerequisites

- **Node.js** >= 18
- **MongoDB** >= 6.0 (running locally or a remote URI)
- **npm** >= 9

## Environment Variables

Copy `backend/.env` and configure:

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/exam_proctoring` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret_change_in_production` |
| `JWT_EXPIRES_IN` | JWT token expiry | `7d` |
| `ADMIN_SECRET_CODE` | Admin registration secret | `admin_secret_123` |

## Installation & Running

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (separate terminal)
cd backend && npm install && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Production build

```bash
cd frontend && npm run build
cd backend && npm start
```

## Tech Stack

**Frontend**: React 18, Vite, Tailwind CSS, Zustand, React Router, Axios, Recharts, Socket.IO Client, face-api.js

**Backend**: Express, Mongoose, JWT, bcryptjs, Socket.IO, express-validator, express-rate-limit

**AI/Proctoring**: face-api.js (TensorFlow.js), WebRTC, Head Pose Estimation via facial landmarks
