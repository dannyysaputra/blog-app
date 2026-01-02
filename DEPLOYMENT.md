# Deployment Guide for KinBlog

This guide covers deploying the **backend** to Heroku and the **frontend** to Netlify.

---

## 🏗️ 1. Backend Deployment (Heroku)

### Prerequisites
*   [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed.
*   A Heroku account.
*   Git installed.

### Steps

1.  **Prepare the Backend Code:**
    *   Ensure your `backend/package.json` has a `start` script: `"start": "node dist/server.js"`.
    *   Ensure you have a `Procfile` in the `backend` root (optional but recommended, or Heroku auto-detects Node.js). We will create one.

2.  **Create a Heroku App:**
    ```bash
    cd backend
    heroku login
    heroku create kinblog-api-YOUR_NAME  # Name must be unique
    ```

3.  **Add MongoDB (Heroku Add-on or Atlas):**
    *   **Option A (Easy):** Use a free MongoDB Atlas cluster and get the connection string (URI).
    *   **Option B (Add-on):** `heroku addons:create mongolab:sandbox` (if available in your region).

4.  **Configure Environment Variables:**
    ```bash
    heroku config:set NODE_ENV=production
    heroku config:set JWT_SECRET=your_secure_random_secret_key
    heroku config:set JWT_EXPIRES_IN=1d
    heroku config:set MONGO_URI="mongodb+srv://..." # Your Atlas URI
    ```

5.  **Deploy:**
    Since your backend is in a subdirectory (`backend/`), we need to push only that folder or configure Heroku to use it. The easiest way for a monorepo structure without complex config is using `git subtree`.

    From the **ROOT** of your project (`kinetix-pro/`):
    ```bash
    git subtree push --prefix backend heroku master
    ```

6.  **Verify:**
    *   Check logs: `heroku logs --tail --app kinblog-api-YOUR_NAME`
    *   Open URL: `https://kinblog-api-YOUR_NAME.herokuapp.com/` (Should see "Welcome to KinBlog API")

---

## 🎨 2. Frontend Deployment (Netlify)

### Prerequisites
*   A Netlify account.
*   Your project pushed to GitHub/GitLab/Bitbucket.

### Steps

1.  **Push Code to GitHub:**
    *   Create a repository on GitHub.
    *   Push your local `kinetix-pro` code to it.

2.  **Create New Site on Netlify:**
    *   Log in to Netlify -> "Add new site" -> "Import from existing project".
    *   Select GitHub and choose your repository.

3.  **Configure Build Settings:**
    *   **Base directory:** `frontend`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`

4.  **Configure Environment Variables (Netlify):**
    *   Go to "Site configuration" -> "Environment variables".
    *   Add variable:
        *   Key: `VITE_API_BASE_URL`
        *   Value: `https://kinblog-api-YOUR_NAME.herokuapp.com` (Your deployed Heroku backend URL, **NOT** localhost).

5.  **Deploy:**
    *   Click "Deploy Site".
    *   Netlify will build your React app.

6.  **Fix Client-Side Routing (Important):**
    *   React Router needs a special file to handle refreshes on Netlify.
    *   Create a file `frontend/public/_redirects` with the content:
        ```
        /*  /index.html  200
        ```
    *   (I will create this file for you now).

---

## ✅ Final Check
1.  Open your Netlify URL.
2.  Try registering a user.
3.  Try creating a post.
4.  If images don't load, ensure your Heroku `uploads/` folder strategy is persistent (Heroku filesystem is ephemeral; images vanish after restart).
    *   *Note: For a real production app on Heroku, you should use AWS S3 or Cloudinary for image uploads. The current local `uploads/` storage is fine for MVP demos but files won't persist on Heroku restarts.*

