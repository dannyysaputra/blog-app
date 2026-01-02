# Deployment Guide for KinBlog

This guide covers deploying the **backend** to Render and the **frontend** to Netlify.

---

## 🏗️ 1. Backend Deployment (Render)

Render is a modern cloud provider that is easier to set up than Heroku for many use cases.

### Prerequisites
*   A [Render](https://render.com/) account.
*   Your project pushed to GitHub/GitLab.

### Steps

1.  **Push Code to GitHub:**
    *   Ensure your `kinetix-pro` project is in a GitHub repository.

2.  **Create a New Web Service on Render:**
    *   Log in to Render Dashboard -> "New +" -> "Web Service".
    *   Connect your GitHub repository.

3.  **Configure Service Settings:**
    *   **Name:** `kinblog-api` (or similar).
    *   **Region:** Choose closest to you.
    *   **Branch:** `master` (or `main`).
    *   **Root Directory:** `backend` (Important!).
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`

4.  **Configure Environment Variables:**
    *   Scroll down to "Environment Variables" section.
    *   Add the following:
        *   `NODE_ENV`: `production`
        *   `JWT_SECRET`: `your_secure_random_secret_key`
        *   `JWT_EXPIRES_IN`: `1d`
        *   `MONGO_URI`: `mongodb+srv://...` (Your MongoDB Atlas connection string).

5.  **Deploy:**
    *   Click "Create Web Service".
    *   Render will start building your app. Watch the logs.
    *   Once "Live", copy the service URL (e.g., `https://kinblog-api.onrender.com`).

### ⚠️ Important Note on Images (Render)
Like Heroku, Render's disk is ephemeral on the free tier. Images uploaded to `uploads/` will persist only as long as the instance runs. If the service restarts (which free tiers do), images are lost.
*   **Recommendation:** For a real app, switch `upload.middleware.ts` to upload to Cloudinary or AWS S3.

---

## 🎨 2. Frontend Deployment (Netlify)

### Prerequisites
*   A Netlify account.
*   Your project pushed to GitHub.

### Steps

1.  **Create New Site on Netlify:**
    *   Log in to Netlify -> "Add new site" -> "Import from existing project".
    *   Select GitHub and choose your repository.

2.  **Configure Build Settings:**
    *   **Base directory:** `frontend`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`

3.  **Configure Environment Variables (Netlify):**
    *   Go to "Site configuration" -> "Environment variables".
    *   Add variable:
        *   Key: `VITE_API_BASE_URL`
        *   Value: `https://kinblog-api.onrender.com` (Your Render Backend URL).

4.  **Deploy:**
    *   Click "Deploy Site".

---

## ✅ Final Check
1.  Open your Netlify URL.
2.  Test Registration/Login.
3.  Test Creating a Post.