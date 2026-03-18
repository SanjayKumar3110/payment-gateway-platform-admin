# Project Overview and Integration Plan

## Goal Description
This document provides a detailed explanation of the frontend and backend architectures in the `shop_admin` project and outlines the necessary steps to connect the React frontend to the Express backend and PostgreSQL database.

### 1. Project Explanation

#### **Frontend (`src/`)**

* **Framework & Tooling**: The frontend is built using **React 19**, powered by **Vite** for fast bundling. It also has configuration for **Electron** wrapping.

* **Architecture**: It is currently defined as a Single Page Application (SPA). Based on [App.tsx](alpha_v0.1.0/shop_admin/src/App.tsx), it uses conditional rendering mapped to a state (`activeTab`) to show different views like Dashboard, Payments, Transactions, Invoices, and Customers.

* **Styling & UI**: It uses standard CSS ([App.css](alpha_v0.1.0/shop_admin/src/App.css), [index.css](alpha_v0.1.0/shop_admin/src/index.css)) and **Lucide React** for icons.

* **Current State**: It operates on mock data (e.g., hardcoded `mock-token-for-ui` bypassing actual login logic) and lacks actual API fetching mechanisms.

#### **Backend (`backend/`)**
* **Framework**: Built with **Node.js** and **Express.js**.

* **Database**: Configured to use **PostgreSQL** (via the `pg` package). The connection is managed in [backend/db.ts](alpha_v0.1.0/shop_admin/backend/db.ts) using connection string from [.env](alpha_v0.1.0/shop_admin/.env).

* **Security & Features**: It uses `cors` and `helmet` for security and includes **Socket.io** integration for real-time events.

* **Routes**: Several RESTful endpoints are predefined such as `/api/auth`, `/api/payment`, `/api/license`, `/api/webhook`, and `/api/sync`.

### 2. Implementation Plan to Connect Frontend, Backend, and Database

To establish a complete flow from the Database -> Backend API -> Frontend UI, the following steps must be taken:

## File Connection Architecture & Flow Diagram

### How Frontend Files Will Connect to Backend Scripts

To establish a proper connection, specific files in the frontend will communicate with corresponding files in the backend. Here is the exact mapping of how data will flow:

1. **The Request Initiator (Frontend UI)**: Components like [src/components/PaymentsPanel.tsx](alpha_v0.1.0/shop_admin/src/components/PaymentsPanel.tsx) or [src/components/DashboardView.tsx](alpha_v0.1.0/shop_admin/src/components/DashboardView.tsx) will trigger a function (e.g., inside a `useEffect` on load or clicking a submit button).

2. **The API Bridge (Frontend Utility)**: A new file `src/api/apiClient.ts` will manage HTTP requests using `axios` or native `fetch`. It will automatically attach the authorization token to headers.

3. **The Entry Router (Backend Main)**: Requests reach [backend/index.ts](alpha_v0.1.0/shop_admin/backend/index.ts). The Express server receives the HTTP request at `http://localhost:5000/api/...` and routes it based on the URL (e.g., `/api/payment` goes to `paymentRoutes`).

4. **The Route Handler (Backend Routes)**: Files like [backend/routes/payment.ts](alpha_v0.1.0/shop_admin/backend/routes/payment.ts) map standard HTTP methods (GET, POST) to specific controller functions.

5. **The Logic & Data Access (Backend Controllers)**: Files inside `backend/controllers/` process the request, validate input, and call `backend/db.ts` to perform database operations.

6. **The Database Engine**: `backend/db.ts` uses the `pg` package to query the PostgreSQL database.

### Flow Diagrams

#### High-Level System Architecture
![alt text](images/system_architecture.png)

#### Detailed Sequence Flow (Example: Fetching Payments)
![alt text](images/detail_sequence_workflow.png)

## Proposed Changes

### Database Setup
1. **Provision PostgreSQL Database**:
   - Ensure a local or remote PostgreSQL instance is running.
   - Create a database (e.g., `payment_platform_db`).

2. **Setup Schema & Migrations**:
   - Define SQL scripts to create tables (e.g., `users`, `transactions`, `payments`, `customers`).
   - Create seed data if needed.

3. **Configure Environment Variables**:
   - Create a `.env` file in the root/backend directory containing the `DATABASE_URL` (e.g., `postgres://user:password@localhost:5432/payment_platform_db`).

### Backend Integration
1. **Ensure API Logic works with Database**:
   - Update controller files inside `backend/controllers/` to query the PostgreSQL database logically using the `query` method from `backend/db.ts`.
   - Setup proper authentication (e.g., JWT) in the `/api/auth` routes.

2. **CORS Configuration**:
   - Update `app.use(cors())` in `backend/index.ts` to explicitly allow the frontend Vite development server (`http://localhost:5173`).

### Frontend Integration
1. **API Configuration**:
   - Create an API utility file (e.g., `src/api/axios.ts` or `src/api/apiClient.ts`) to configure the base URL (`http://localhost:5000/api`) and automatically attach access tokens to requests.

2. **State Management & Data Fetching**:
   - **Authentication**: Remove the mock token from `src/App.tsx`. Create a Login component that posts to `/api/auth/login`, receives a JWT, stores it (e.g., in localStorage or Context), and authenticates the user.

   - **Views**: Inside `src/components/`, update views like `Dashboard`, `PaymentsView`, and `TransactionsTable` to fetch real data from the backend using `useEffect` and React state (or a tool like React Query).
   
3. **Socket Integration** (Optional but recommended):
   - Hook the frontend to the backend's Socket.io instance to listen for real-time updates (e.g., new payments).

## Verification Plan

### Manual Verification
1. **Database testing**: Run the backend and hit a testing endpoint (like `/api/health`) to ensure the server runs and does not crash on DB initialization.
2. **API testing**: Test backend routes using Postman or cURL (e.g., POST to register a user, POST to login and get a token, GET transactions).
3. **Frontend Connection testing**: Start the frontend (`npm run dev`), go through the Login UI, verify the token is stored, and check the network tab to ensure Dashboard data calls return 200 OK from `localhost:5000`.
