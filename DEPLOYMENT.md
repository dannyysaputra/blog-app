# Deployment Guide for KinBlog

This guide covers deploying the **backend** to Koyeb and the **frontend** to Netlify.

---

## 🏗️ 1. Backend Deployment (Koyeb)

Koyeb is a developer-friendly serverless platform that runs standard Node.js applications efficiently (like Render/Heroku).

### Prerequisites
*   A [Koyeb](https://www.koyeb.com/) account.
*   Your project pushed to GitHub.

### Steps

1.  **Push Code to GitHub:**
    *   Ensure your `kinetix-pro` project is in a GitHub repository.

2.  **Create a New App on Koyeb:**
    *   Log in to Koyeb Dashboard -> "Create App".
    *   Select **GitHub** as the deployment method.
    *   Connect your repository.

3.  **Configure Service Settings:**
    *   **Repository:** Select your repo.
    *   **Branch:** `master` (or `main`).
    *   **Work Directory:** `backend` (Important! This tells Koyeb where the app lives).
    *   **Builder:** `Standard` (Koyeb detects Node.js automatically).
    *   **Build Command:** `npm install && npm run build`
    *   **Run Command:** `npm start`

4.  **Configure Environment Variables:**
    *   In the "Environment Variables" section, add:
        *   `NODE_ENV`: `production`
        *   `JWT_SECRET`: `your_secure_random_secret_key`
        *   `JWT_EXPIRES_IN`: `1d`
        *   `MONGO_URI`: `mongodb+srv://...` (Your MongoDB Atlas connection string).

5.  **Deploy:**
    *   Click "Deploy".
    *   Koyeb will build and start your application.
    *   Once healthy, copy the Public URL (e.g., `https://kinblog-api-xyz.koyeb.app`).

### ⚠️ Important Note on Images (Koyeb)
Like other cloud platforms (Heroku, Render, Vercel), Koyeb instances are ephemeral.
**Local uploads to `uploads/` will NOT persist across deployments or restarts.**
*   **Solution:** For a production app, integrate Cloudinary or AWS S3 for storage.
*   For this demo, images will work only as long as the current instance is running.

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
    *   Value: `https://kinblog-api-xyz.koyeb.app` (The URL you got from Koyeb).

4.  **Deploy:**
    *   Click "Deploy Site".

---

## ✅ Final Check
1.  Open your Netlify URL.
2.  Test Registration/Login.
3.  Test Creating a Post.