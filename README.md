# Exam Proctoring Dashboard

A full-stack exam proctoring system with real-time face detection, head pose tracking, and suspicious activity monitoring.

## Project Structure

```
Exam_Proctoring_Dashboard/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # React components (admin, student, analytics, proctor, common, layout)
│   │   ├── hooks/        # Custom React hooks (webcam, face detection, tab detection, timer, fullscreen)
│   │   ├── services/     # Axios API client modules
│   │   ├── store/        # Zustand state management
│   │   └── utils/        # Constants, helpers, validators
│   ├── public/           # Static assets (face-api.js models)
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Express + Mongoose + Socket.IO
│   ├── controllers/      # Route handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── middleware/        # Auth, validation, error handling
│   ├── config/           # DB connection, environment config
│   ├── utils/            # AppError, catchAsync, socket helpers
│   ├── validators/       # express-validator rules
│   ├── socket/           # Socket.IO proctoring events
│   ├── uploads/          # File uploads directory
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
│
├── .gitignore
└── README.md          # This file
```

## Prerequisites

- **Node.js** >= 18
- **MongoDB** >= 6.0 (running locally or a remote URI)
- **npm** >= 9

## Environment Variables

Copy `backend/.env` and configure:

| Variable          | Description                     | Default                                           |
|-------------------|---------------------------------|---------------------------------------------------|
| `NODE_ENV`        | Environment mode                | `development`                                     |
| `PORT`            | Backend server port             | `5000`                                            |
| `MONGO_URI`       | MongoDB connection string       | `mongodb://localhost:27017/exam_proctoring`       |
| `JWT_SECRET`      | JWT signing secret              | `your_jwt_secret_change_in_production`            |
| `JWT_EXPIRES_IN`  | JWT token expiry                | `7d`                                              |
| `ADMIN_SECRET_CODE` | Admin registration secret     | `admin_secret_123`                                |

## Installation

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

## Running the Application

### Frontend (development)

```bash
cd frontend && npm run dev
```

Runs on http://localhost:5173

### Backend (development)

```bash
cd backend && npm run dev
```

Runs on http://localhost:5000

### Production build

```bash
cd frontend && npm run build
cd backend && npm start
```

## API Endpoints

| Method | Endpoint                      | Access  | Description                |
|--------|-------------------------------|---------|----------------------------|
| POST   | `/api/auth/register`          | Public  | Student registration       |
| POST   | `/api/auth/login`             | Public  | Student login              |
| GET    | `/api/auth/me`                | Student | Get current student        |
| GET    | `/api/exams`                  | Student | List available exams       |
| GET    | `/api/exams/:id`              | Student | Get exam details           |
| POST   | `/api/exams`                  | Admin   | Create exam                |
| PUT    | `/api/exams/:id`              | Admin   | Update exam                |
| DELETE | `/api/exams/:id`              | Admin   | Delete exam                |
| POST   | `/api/questions`              | Admin   | Create question            |
| POST   | `/api/questions/bulk`         | Admin   | Bulk create questions      |
| GET    | `/api/questions/exam/:examId` | Admin   | Get questions by exam      |
| POST   | `/api/results/submit`         | Student | Submit exam answers        |
| GET    | `/api/results/my-results`     | Student | Get my results             |
| GET    | `/api/results/exam/:examId`   | Admin   | Get exam results           |
| POST   | `/api/proctor/log`            | Student | Log suspicious activity    |
| POST   | `/api/admin/login`            | Public  | Admin login                |
| GET    | `/api/admin/stats`            | Admin   | Dashboard statistics       |
| GET    | `/api/admin/analytics`        | Admin   | Full analytics data        |
| GET    | `/api/admin/rankings`         | Admin   | Student performance rankings |
| GET    | `/api/admin/violation-trends` | Admin   | Daily violation trends     |
| GET    | `/api/admin/pass-fail-distribution` | Admin | Pass/fail per exam    |

## Tech Stack

**Frontend**: React 18, Vite, Tailwind CSS, Zustand, React Router, Axios, Recharts, Socket.IO Client, face-api.js

**Backend**: Express, Mongoose, JWT, bcryptjs, Socket.IO, express-validator, express-rate-limit

**AI/Proctoring**: face-api.js (TensorFlow.js), WebRTC, Head Pose Estimation via facial landmarks
