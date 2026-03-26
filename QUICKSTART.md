# 🚀 PayPlatform Admin — Quickstart Guide

> A premium glassmorphism admin dashboard built with **React + TypeScript + Vite + Electron**.

---

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | v20.19+ or v22.12+ |
| Git | Latest |

---

## 1. Clone & Install

```bash
git clone <repository_url>
cd payment-gateway-platform-admin
npm install
```

## 2. Run — Development Mode

```bash
npm run electron:dev
```

This launches both the **Vite dev server** (`localhost:5173`) and the **Electron desktop window** with hot-reload.

> **Electron not working?** Run: `npm install electron@latest --save-dev` then retry.

## 3. Build — Windows Installer (.exe)

```bash
npm run electron:build
```

Output → `release/` folder (NSIS installer).

---

## 🔐 Login Credentials (Demo)

| Field | Value |
|-------|-------|
| Email | Any valid email (e.g. `admin@payplatform.in`) |
| Password | Any password with **4+ characters** |

---

## 📁 Project Structure

```
src/
├── pages/                    # Main views (one folder per page)
│   ├── Login/
│   │   ├── index.tsx         # Auth page with glassmorphism UI
│   │   └── Login.css         # Animations, orbs, glass card
│   ├── Dashboard/
│   │   └── index.tsx         # Charts, time-range filter, recent payments
│   ├── Analytics/
│   │   └── index.tsx         # Area charts, revenue metrics
│   ├── Payments/
│   │   └── index.tsx         # Filterable payment table with pagination
│   ├── Invoices/
│   │   └── index.tsx         # Invoice management with bar charts
│   └── Settings/
│       └── index.tsx         # App settings panel
│
├── components/
│   ├── ui/
│   │   └── Dropdown.tsx      # Shared reusable dropdown
│   ├── charts/
│   │   └── InvoiceChart.tsx  # Recharts bar chart component
│   └── css/
│       └── components.css    # Shared component styles
│
├── data/                     # Mock JSON data
│   ├── dashboard.json
│   ├── payments.json
│   └── invoices.json
│
├── App.tsx                   # Root layout, sidebar, topbar, routing
├── App.css                   # Global theme (light/dark mode variables)
├── index.css                 # Base reset styles
└── main.tsx                  # React entry point
```

---

## 🎨 Design System

| Variable | Light Mode | Dark Mode |
|----------|-----------|-----------|
| `--bg` | Tech-mesh gradient (indigo/purple orbs) | Deep space (amethyst/sapphire) |
| `--surface` | `rgba(255,255,255,0.7)` glass | `rgba(255,255,255,0.12)` glass |
| `--text-primary` | `#111111` | `#F8FAFC` |
| `--glass-blur` | `blur(32px) saturate(200%)` | Same |

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server only (browser) |
| `npm run electron:dev` | Full Electron + Vite (desktop app) |
| `npm run electron:build` | Production build → `.exe` installer |
| `npm run server` | Backend API server |

---

## ⚡ Key Features

- **Token-gated auth** — Login page → Dashboard flow with Sign Out
- **Dark / Light mode** — Toggle via sidebar button
- **Interactive charts** — Recharts with time-range filtering (Week/Month/Year)
- **Glassmorphism UI** — Frosted glass cards, animated gradient backgrounds
- **Responsive** — Sidebar collapses on mobile with hamburger menu

---

## 📂 Ignored Folders

| Folder | Purpose |
|--------|---------|
| `node_modules/` | NPM packages |
| `dist/` | Vite production build |
| `release/` | Electron installer output |