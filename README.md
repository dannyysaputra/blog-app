# KinBlog - Full-Stack Blog Platform

A production-ready, full-stack blog platform with authentication, posts, comments, and a polished UI with subtle animations.

## 🚀 Live Demo

- **Frontend**: [https://kine-blog.netlify.app/](https://kine-blog.netlify.app/)
- **Backend API**: [https://acceptable-sheelah-kinetix-d26179eb.koyeb.app/](https://acceptable-sheelah-kinetix-d26179eb.koyeb.app/)
- **API Documentation (Swagger)**: [https://acceptable-sheelah-kinetix-d26179eb.koyeb.app/api/docs](https://acceptable-sheelah-kinetix-d26179eb.koyeb.app/api/docs)

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Multer
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, React-Markdown
- **Documentation**: OpenAPI 3.0 (Swagger)

---

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```
- Server runs on `http://localhost:8000` (or your chosen PORT).
- **Environment Variables (.env)**:
  ```env
  PORT=8000
  MONGO_URI=mongodb://localhost:27017/kinblog
  JWT_SECRET=your_secret_key
  JWT_EXPIRES_IN=1d
  NODE_ENV=development
  ```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- App runs on `http://localhost:5173`.
- **Environment Variables (.env)**:
  ```env
  VITE_API_BASE_URL=http://localhost:8000
  ```

---

## 🔌 API Structure & Interaction

The backend follows a RESTful architecture. You can interact with it via the following endpoints:

### Auth & User
- `POST /auth/register`: Create a new account.
- `POST /auth/login`: Authenticate and receive a JWT.
- `GET /auth/profile`: Get current user details (Private).
- `POST /users/profile/upload`: Upload profile picture (Private).

### Blog Posts
- `GET /posts`: List all posts (Public, includes Search & Pagination).
- `POST /posts`: Create a post (Private).
- `GET /posts/:id`: Get detailed post content (Public).
- `PUT /posts/:id`: Update your own post (Private).
- `DELETE /posts/:id`: Delete your own post (Private).

### Comments
- `GET /posts/:id/comments`: View discussion on a post (Public).
- `POST /posts/:id/comments`: Add a comment (Private).
- `DELETE /comments/:id`: Remove your own comment (Private).

*Note: All "Private" routes require a `Authorization: Bearer <token>` header.*

---

## 🧠 Design Decisions & Assumptions

### 1. Monorepo-ish Structure
To keep the project self-contained, both `backend` and `frontend` are in the same repository but managed as separate Node projects. This simplifies deployment to platforms like Koyeb and Netlify.

### 2. Search & Pagination
Instead of loading all posts at once, the API implements server-side pagination (`limit=6`) and regex-based searching to ensure performance scales as the database grows.

### 3. Markdown Support
Content is stored as raw text in MongoDB, but the frontend uses `react-markdown` with GFM (GitHub Flavored Markdown) support. This allows for rich content (headers, bold, code) without needing a complex HTML editor.

### 4. Security (Helmet & CORS)
Implemented `helmet` for security headers. Specifically configured `crossOriginResourcePolicy` to ensure that profile pictures served from the backend can be displayed on the frontend domain.

### 5. Ephemeral Storage Assumption
For this MVP, images are stored in a local `uploads/` folder. I have assumed that for a persistent production environment beyond this demo, a cloud provider like Cloudinary or AWS S3 would be integrated, as Koyeb/Vercel disks are ephemeral.

### 6. Neutral Aesthetic
The UI was built with a "Neutral/Minimalist" design philosophy, using a grayscale palette with blue accents to keep the focus on the content and micro-animations.