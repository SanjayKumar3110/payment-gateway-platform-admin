# 🚀 Quickstart Guide

Welcome to the Admin Dashboard! This guide will help you get the system running locally and learn how to contribute.

---

## 🛠️ Step 1: Clone from GitHub

To get started, you'll need to clone the repository to your local machine:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install Dependencies:**
   Ensure you have [Node.js](https://nodejs.org/) (v20+) installed. Run:
   ```bash
   npm install
   ```

---

## 🏃‍♂️ Step 2: Running the Project Locally

There are several options to run the project depending on what you want to work on:

### Start Frontend ONLY
To run just the Vite frontend server:
```bash
npm run dev
```

### Start Backend ONLY
To run just the backend Express server:
```bash
npm run server
```

### Start Both (Web Mode)
To run both the Vite frontend and the backend server concurrently:
```bash
npm run dev:all
```

### Start Electron Desktop App (Full Mode)
To run the full stack as a desktop application (Frontend, Backend, and Electron shell):
```bash
npm run electron:dev
```
*The dashboard frontend will run at `http://localhost:5173` and the backend will start at `http://localhost:5000`.*

---

## 🔗 Step 3: Localhost Endpoints

When running locally, here are the default URLs and API endpoints available:

### Core Services
- **Frontend URL:** `http://localhost:5173`
- **Backend API Base URL:** `http://localhost:5000`
- **Standalone Checkout Page:** `http://localhost:5173/checkout.html`

### Backend Endpoints
All API endpoints are prefixed with `/api` unless otherwise noted.

**Authentication & Settings (`/api`)**
- `POST /api/login` - Login to the dashboard
- `POST /api/signup` - Register a new user
- `POST /api/update-keys` - Update Payment Integration / API Keys

**Payments (`/api`)**
- `GET /api/payments` - Retrieve transaction logs
- `POST /api/process-external` - Process/Simulate external payments
- `POST /api/webhook` - Webhook listener for payment statuses

**Password Reset (`/api`)**
- `POST /api/forgot-password` - Request password reset code
- `POST /api/verify-reset-code` - Verify the emailed reset code
- `POST /api/reset-password` - Set the new password

**Other APIs**
- `GET /` - Health check route
- `GET /api/remote-access` - Retrieve ngrok/QR tunneling data for mobile access

---

## 🔄 Step 4: Making Changes and Using Git

Once you've made your changes in the local repository, here is the standard workflow to push your updates back to GitHub:

1. **Check the status of your changes:**
   ```bash
   git status
   ```

2. **Add changes to staging:**
   ```bash
   # To add specific files:
   git add <filename>

   # To add all changed files:
   git add .
   ```

3. **Commit your changes:**
   ```bash
   git commit -m "Describe what you accomplished in this commit"
   ```

4. **Pull latest changes from the main branch** (to avoid conflicts):
   ```bash
   git pull origin main
   ```

5. **Push your changes to GitHub:**
   ```bash
   git push origin main
   ```
*(Note: If you are working on a separate branch, replace `main` with your branch name, e.g., `git push origin my-feature-branch`)*

---

## 🛡️ Going Production

When you are ready for real payments instead of Demo mode:
1. Get your **Key ID** and **Key Secret** from your Payment Provider Dashboard.
2. Update them in the **Settings** panel of this app under **Payment Integration**.
3. The system will automatically switch from "Demo Mode" to live transactions.
