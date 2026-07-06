<p align="center">
  <img src="https://img.shields.io/badge/BullVerse-India-10b981?style=for-the-badge&logo=bitcoin&logoColor=white" alt="BullVerse India" />
  <img src="https://img.shields.io/badge/AI-Powered-f59e0b?style=for-the-badge&logo=openai&logoColor=white" alt="AI Powered" />
  <img src="https://img.shields.io/badge/Indian_Stock-Exchange-3b82f6?style=for-the-badge&logo=tradingview&logoColor=white" alt="Stock Exchange" />
</p>

<h1 align="center">🐂 BullVerse India</h1>

<p align="center">
  <strong>India's AI-Powered Intelligent Stock Exchange Platform</strong><br/>
  Track, analyze, and simulate trading across Stocks, ETFs, Mutual Funds, IPOs & Crypto — all from one unified premium dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
</p>

---

## ✨ Overview

**BullVerse India** is a full-stack, production-grade financial dashboard and trading simulation platform built for the Indian stock market. It features **17+ interactive pages**, an **AI wealth coach (BullMind)**, **biometric authentication (Touch ID / Face ID)**, and a **Node.js/SQLite backend** — all wrapped in a stunning glassmorphism dark UI.

---

## 🚀 Features

### 📊 Market & Trading
- **Live Ticker Marquee** — Real-time scrolling stock price feed
- **Indian Markets Dashboard** — NIFTY 50, SENSEX, BANK NIFTY with sector heatmaps & FII/DII flows
- **35+ Listed Stocks** — Full company detail pages with financials, shareholding patterns, quarterly results & balance sheets
- **AI Stock Screener** — Filter stocks by P/E, ROE, market cap, dividend yield, debt ratio & more

### 💰 Investment Centers
- **16 ETFs** — Across Core Indices, Sectoral, Commodities, Thematic/ESG & International categories
- **ETF X-Ray Modal** — Deep breakdown with holdings, sector allocation charts & overlap analyzer
- **20+ Mutual Funds** — NAV tracking, SIP calculator, 1Y/3Y/5Y returns, risk ratings
- **IPO Center** — Upcoming/Open/Listed IPOs with GMP trends & subscription data
- **Crypto Trading** — BTC, ETH, SOL, BNB, XRP & more with INR pricing and staking rewards

### 🤖 AI & Portfolio
- **BullMind AI Assistant** — Full-screen conversational AI wealth coach
- **Smart Tools** — Strategy backtester, portfolio health check, risk analyzer, sector rotation detector
- **Portfolio Manager** — Real-time P&L tracking with sector allocation donut charts
- **Unified Transaction Modal** — Trade any asset class (Stock/ETF/Crypto/MF) from one modal
- **Starting Balance** — ₹10,00,000 cash + ₹2,85,000 margin facility

### 🔒 Security & Auth
- **Biometric Login** — Touch ID / Face ID enrollment with scanning animation
- **JWT Authentication** — Secure session management with bcrypt password hashing
- **Google Authenticator 2FA** — TOTP-based two-factor authentication via Speakeasy
- **Offline Sandbox Mode** — Full functionality without backend using localStorage fallback

### 📚 Learning & Social
- **Learning Center** — Investment education modules from beginner to advanced
- **Investor Community** — Social feed for sharing analysis and discussion
- **Market News** — Curated financial news with category filters
- **Watchlist** — Personal stock tracking with live price updates

### ⚙️ Admin & Settings
- **Admin Dashboard** — User database, system logs, trade ledger, server health
- **User Profile** — Account stats, membership tier, trade history
- **Settings** — Theme preferences, notifications, data management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5 + Vanilla JavaScript |
| **Styling** | Tailwind CSS + Custom Glassmorphism CSS |
| **Icons** | Lucide Icons |
| **Typography** | Inter + Poppins (Google Fonts) |
| **Charts** | Custom Canvas-based Donut & Bar Charts |
| **Backend** | Node.js + Express.js |
| **Database** | SQLite3 (Serverless) |
| **Auth** | JWT + bcrypt + Speakeasy (TOTP 2FA) |
| **Biometrics** | Touch ID / Face ID Mock Integration |

---

## 📁 Project Structure

```
Bull-Verse/
├── index.html                 # Main SPA (17+ views, 272 KB)
├── css/
│   └── style.css              # Custom glassmorphism styles (44 KB)
├── js/
│   ├── app.js                 # Main application controller (334 KB)
│   ├── data.js                # Mock financial database (131 KB)
│   ├── portfolio.js           # Transaction engine & tax calculator
│   ├── charts.js              # Canvas donut & bar chart renderer
│   ├── ai.js                  # BullMind AI assistant logic
│   └── community.js           # Social feed module
├── server/
│   ├── server.js              # Express REST API server
│   ├── auth.js                # JWT + Biometric authentication
│   ├── database.js            # SQLite connection manager
│   ├── database.sqlite        # Persistent data store
│   └── package.json           # Backend dependencies
├── images/                    # Static assets
└── README.md                  # This file
```

---

## ⚡ Quick Start

### Option 1: Frontend Only (Sandbox Mode)
Simply open `index.html` in your browser — the app works fully offline with mock data.

```bash
# Clone the repo
git clone https://github.com/pkathan97-prog/Bull-Verse.git
cd Bull-Verse

# Open in browser
open index.html
```

> Click **"Run in Sandbox Fallback Mode"** on the login screen to skip authentication.

### Option 2: Full Stack (With Backend)

```bash
# 1. Clone the repo
git clone https://github.com/pkathan97-prog/Bull-Verse.git
cd Bull-Verse

# 2. Install backend dependencies
cd server
npm install

# 3. Start the API server
npm start

# 4. Open frontend
open ../index.html
```

The backend runs on **port 5005** with the following output:
```
Connecting to local SQLite database...
Successfully connected to SQLite database.
=========================================
BullVerse Backend running on port 5005
REST Gateways connected to SQLite engine.
=========================================
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create account + biometric enrollment |
| `POST` | `/api/auth/login` | ❌ | Email/password login → JWT token |
| `POST` | `/api/auth/biometric/login` | ❌ | Biometric credential verification |
| `GET` | `/api/portfolio` | ✅ | Fetch holdings, balance, transactions |
| `POST` | `/api/trade` | ✅ | Execute BUY/SELL order (any asset) |
| `POST` | `/api/watchlist/toggle` | ✅ | Add/remove from watchlist |
| `GET` | `/api/admin/dashboard` | ✅ | Admin panel data & logs |

---

## 🔐 Authentication Flow

1. **Register** → Create account with email & password
2. **Biometric Enrollment** → Optionally enroll Touch ID / Face ID
3. **2FA Setup** → Scan QR code with Google Authenticator
4. **Login Options:**
   - Email + Password + 2FA code
   - Biometric (Touch ID / Face ID) one-tap login
   - Sandbox mode (skip auth for testing)

---

## 📊 Data Coverage

| Category | Count | Examples |
|----------|-------|---------|
| **Stocks** | 35+ | RELIANCE, TCS, HDFCBANK, INFY, TATAMOTORS |
| **ETFs** | 16 | NIFTYBEES, GOLDBEES, BANKBEES, MAFANG |
| **Mutual Funds** | 20+ | Across Equity, Debt, Hybrid, ELSS, Index |
| **IPOs** | 8+ | With GMP, subscription data, listing dates |
| **Crypto** | 8 | BTC, ETH, SOL, BNB, XRP, DOGE, ADA, MATIC |
| **Indices** | 5 | NIFTY 50, SENSEX, BANK NIFTY, NIFTY IT, MIDCAP |

---

## 🎨 Design Highlights

- **Dark Glassmorphism UI** — Semi-transparent cards with backdrop blur
- **Color Palette** — Emerald green (profit), Red (loss), Amber (highlights), Electric blue (info)
- **Micro-animations** — Smooth hover effects, pulse animations, transitions
- **Responsive Layout** — Collapsible sidebar, adaptive grid layouts
- **Custom SVG Logo** — Gradient bull icon with glow filter

---

## 👨‍💻 Author

**Kathan Patel** — [@pkathan97-prog](https://github.com/pkathan97-prog)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <strong>Built with ❤️ for the Indian investor community</strong>
</p>
