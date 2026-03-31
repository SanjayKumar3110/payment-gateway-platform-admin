# 🚀 Payment Gateway Platform - Quickstart Guide

Welcome to the Admin Dashboard! This guide will help you get the system running and test a live payment flow in **less than 5 minutes**, even if you don't have a Razorpay account yet.

---

## 🛠️ Step 1: Initial Setup

Ensure you have [Node.js](https://nodejs.org/) (v20+) installed.

1. **Install Dependencies**:
   Open a terminal in the project folder and run:
   ```bash
   npm install
   ```
2. **Start the System**:
   Run both the dashboard and the backend server with one command:
   ```bash
   npm run dev:all
   ```
   *The dashboard will open at `http://localhost:5173` and the backend will run at `http://localhost:5000`.*

---

## 💳 Step 2: Test a Payment (No Keys Needed)

We have built a **"Demo Mode"** so you can see the system in action immediately.

1. **Configure Demo Keys**:
   - In the Admin App, go to **Settings** → **Payment Integration**.
   - Enter **`DEMO`** in the **Key ID** field.
   - Enter **`DEMO`** in the **Key Secret** field.
   - Click **Save API Keys**.

2. **Open the Checkout Page**:
   - Visit: [http://localhost:5173/checkout.html](http://localhost:5173/checkout.html)
   - Enter any amount (e.g., `5000`) and click **Pay with Razorpay**.
   - Click the green **"Simulate Successful UPI Payment"** button.

---

## 📊 Step 3: Verify the Result

Once the payment is simulated, you can verify it across the platform:

- **Dashboard**: Check the **"Recent Payment Log"** at the bottom. Your new payment will appear at the top.
- **Payments Page**: Go to the **Payments** sidebar. You'll see the full transaction list with the new "DEMO" entry.
- **Analytics**: Watch the **Total Revenue** and **Total Transactions** counters increase in real-time.

---

## 📂 Project Structure

- `/src`: The React frontend (Dashboard, Analytics, Settings).
- `/backend`: The Express server handling order creation and verification.
- `/backend/payments.json`: The database where real payments are stored.
- `/public/checkout.html`: A standalone test environment for customers.

---

## 🛡️ Going Production

When you are ready for real payments:
1. Get your **Key ID** and **Key Secret** from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys).
2. Update them in the **Settings** panel of this app.
3. The system will automatically switch from "Demo Mod

**Windows (PowerShell):**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -Force
```

**Mac/Linux:**
```bash
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:5173)
```

**Quick Tip:** By running these commands, you free up the ports so they can be securely used again the next time you start the server. You should also make sure to use `Ctrl + C` in the terminal to gracefully stop the current processes before closing the window.

---
*Created by Antigravity - Your Agentic Coding Assistant*
