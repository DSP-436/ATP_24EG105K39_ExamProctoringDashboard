# Exam Proctoring Dashboard

Exam Proctoring Dashboard is a full-stack web application built using the MERN stack. It helps conduct online examinations while monitoring students through AI-based proctoring features such as face detection, multiple-face detection, head pose tracking, fullscreen monitoring, and suspicious activity logging.

## Features

* Secure student and admin authentication
* Create and manage exams
* Question management system
* Real-time exam monitoring
* Face detection using face-api.js
* Multiple face and no-face detection
* Head pose tracking
* Tab switch and fullscreen monitoring
* Suspicious activity logging
* Student result management
* Admin analytics dashboard
* Real-time communication using Socket.IO

## Tech Stack

Frontend:

* React
* Vite
* Tailwind CSS
* Zustand
* Axios
* Socket.IO Client
* face-api.js

Backend:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Socket.IO

## Project Structure

```text
Exam_Proctoring_Dashboard
├── frontend
├── backend
├── .gitignore
└── README.md
```

## Installation

Clone the repository and install dependencies:

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

## Environment Variables

Create a `.env` file inside the backend folder and add:

```env
PORT=5000
MONGO_URI=**********
JWT_SECRET=**************
ADMIN_SECRET_CODE=******
```

## Running the Project

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

## Main Modules

* Authentication Module
* Exam Management Module
* Question Management Module
* Result Management Module
* AI Proctoring Module
* Analytics Dashboard

## Future Enhancements

* Eye gaze tracking
* Voice activity detection
* Browser extension monitoring
* Advanced AI-based cheating detection
* Cloud deployment and scaling

## Author

Developed as an individual MERN Stack project for online examination monitoring and management.