# Deployment Guide for KinBlog

This guide covers deploying the **backend** to Vercel (or Render/Heroku) and the **frontend** to Netlify.

---

## 🏗️ 1. Backend Deployment (Vercel) - Recommended

Vercel is excellent for both frontend and serverless Node.js backends.

### Prerequisites
*   A [Vercel](https://vercel.com/) account.
*   Your project pushed to GitHub.

### Steps

1.  **Push Code to GitHub:**
    *   Ensure your `kinetix-pro` project is in a GitHub repository.

2.  **Import Project in Vercel:**
    *   Log in to Vercel Dashboard -> "Add New..." -> "Project".
    *   Connect your GitHub repository.

3.  **Configure Project Settings:**
    *   **Framework Preset:** Other (or leave default).
    *   **Root Directory:** `backend` (Click "Edit" next to Root Directory and select the `backend` folder).
    *   **Build Command:** `npm run build` (Optional, Vercel infers).
    *   **Output Directory:** `dist` (Optional).

4.  **Configure Environment Variables:**
    *   Expand "Environment Variables".
    *   Add:
        *   `NODE_ENV`: `production`
        *   `JWT_SECRET`: `your_secure_random_secret_key`
        *   `JWT_EXPIRES_IN`: `1d`
        *   `MONGO_URI`: `mongodb+srv://...` (Your MongoDB Atlas connection string).

5.  **Deploy:**
    *   Click "Deploy".
    *   Vercel will build and deploy the backend as Serverless Functions.
    *   Once live, copy the URL (e.g., `https://kinblog-api.vercel.app`).

### ⚠️ Important Note on Images (Vercel)
Vercel Serverless Functions are ephemeral and read-only.
**You CANNOT upload images to the local `uploads/` folder.** The upload will fail or the image will vanish immediately.
*   **Solution:** You must use a cloud storage service like AWS S3, Cloudinary, or Firebase Storage for user uploads in production.
*   For this MVP demo on Vercel, **image upload will NOT persist**.

---

## 🏗️ 1.1 Backend Deployment (Alternative: Render)

If you prefer a traditional persistent server (which restarts occasionally but behaves like a normal Node app), use Render.

1.  **Create Web Service on Render:**
    *   Connect GitHub repo.
    *   **Root Directory:** `backend`.
    *   **Build Command:** `npm install && npm run build`.
    *   **Start Command:** `npm start`.
    *   **Environment Variables:** Add `MONGO_URI`, `JWT_SECRET`, etc.

---

## 🎨 2. Frontend Deployment (Netlify)

### Steps

1.  **Create New Site on Netlify:**
    *   Import from GitHub.

2.  **Configure Build Settings:**
    *   **Base directory:** `frontend`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`

3.  **Configure Environment Variables (Netlify):**
    *   Key: `VITE_API_BASE_URL`
    *   Value: `https://your-backend-url.vercel.app` (The URL you got from Vercel/Render).

4.  **Deploy:**
    *   Click "Deploy Site".

---

## ✅ Final Check
1.  Open your Netlify URL.
2.  Test Registration/Login.
3.  Test Creating a Post.
