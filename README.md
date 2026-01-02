# KinBlog - Full-Stack Blog Platform

A production-ready, full-stack blog platform with authentication, posts, comments, and a polished UI with subtle animations.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB, JWT
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Documentation**: OpenAPI (Swagger)

## Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm run build
npm start
```

- Server runs on `http://localhost:5000`
- API Documentation: `http://localhost:5000/api/docs`

**Environment Variables (.env)**
Ensure `backend/.env` exists (created automatically during setup):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kinblog
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- App runs on `http://localhost:5173`

## Features

- **Authentication**: Register, Login, Logout (JWT)
- **Blog Posts**: Create, Read, Update, Delete (CRUD)
- **Comments**: Add, Delete
- **Profile**: View your own posts
- **UI**: Responsive design, page transitions, loading states
