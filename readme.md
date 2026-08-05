# 🚀 BizPilot AI
![React](https://img.shields.io/badge/React-19-blue)
![Node](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-blue)
![Groq](https://img.shields.io/badge/Groq-AI-orange)
![License](https://img.shields.io/badge/License-ISC-yellow)
> An AI-powered CRM, POS, and Business Intelligence System built for modern retail merchants and enterprise stores.

BizPilot AI helps shop owners manage customers, sales transactions, digital invoices, daily tasks, and store analytics from one unified workspace. It features a Multilingual AI Business Partner (English, Hindi, Bengali) that analyzes live merchant data and delivers strategic executive advice via text and voice.

### 🏷️ Repository Topics
`react` `nodejs` `express` `mongodb` `tailwind-css` `vite` `ai` `groq` `llama3` `crm` `pos` `billing-system` `invoice-generator` `voice-assistant` `speech-recognition` `multilingual` `bengali` `hindi` `jwt-authentication` `nodemailer`

---

## ✨ Features

- 🔐 **Authentication & Security**: Secure JWT Authentication, Google OAuth 2.0 Single Sign-On, and Email Password Reset link flow.
- 📧 **Automated Password Reset**: 15-minute expiring JWT password reset links with HTML email delivery via Nodemailer SMTP.
- 🌐 **Native Multilingual AI**: AI Copilot & Voice synthesis in **English 🇬🇧**, **Hindi 🇮🇳 (हिंदी)**, and **Bengali 🇧🇩 (বাংলা)**.
- 📥 **1-Click Bulk Data Migration**: Import Excel (.xlsx) & CSV (.csv) customer ledgers and sales records.
- 🔄 **Smart Duplicate Resolution**: Merge duplicate profiles, skip matching phone/email, or create side-by-side records.
- 👥 **Customer CRM**: Active/Inactive account tracking with normalized 10-digit phone validation and dues breakdown.
- 💰 **Point of Sale (POS) Billing**: Fast checkout terminal with live cart feedback and double-click prevention.
- 🧾 **Digital & Thermal Invoices**: Official printable invoice receipts with custom business headers.
- 💬 **WhatsApp Commerce**: 1-Click WhatsApp invoice sharing and payment reminder statements.
- 🤖 **Executive AI Consultant**: Deep business diagnostics (revenue velocity, peak sales days, slow-moving items, VIP clients).
- 🎙️ **Voice Speech-to-Text Copilot**: Hands-free voice command recognition via Web Speech API.
- 🔊 **Voice Text-to-Speech Assistant**: Complete sentence reading with punctuation chunking for Hindi & Bengali.
- 💀 **Animated Skeleton Loaders**: Shimmer table, card, and metric loaders for smooth data fetching.
- 🪟 **React Portal Modals**: Fully viewport-centered modals with sticky action footers for phone and desktop screens.
- 📈 **Real-Time Analytics**: Visual revenue charts, average order value (AOV), and financial metrics.
- 📄 **Executive PDF Reports**: 1-click corporate financial summary PDF exports.
- ✅ **Task Management**: Prioritized operational task board with due dates and status tracking.
- 🌙 **Modern Design System**: Glassmorphism aesthetic, dark/light mode toggle, and micro-animations.

---

## 🤖 Multilingual AI Copilot

BizPilot AI acts as a Senior Executive AI Business Partner capable of:

- 📊 **Revenue Diagnostics**: Analyzing daily/weekly sales velocity and peak transaction days.
- 👥 **CRM Exposure Analysis**: Identifying top-grossing clients and unpaid credit balances.
- 📦 **Inventory Velocity**: Highlight star-performing items vs. slow-moving stock.
- 🌐 **Multilingual Voice Communication**: Interactive voice Q&A in English, Hindi (हिंदी), and Bengali (বাংলা).
- ⚡ **Offline Intelligent Fallback**: Smart rules engine for instant local data insights when offline.

---

## 🛠️ Tech Stack

### Frontend

- **Core**: React 19, Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS Design Tokens
- **Routing**: React Router v7
- **UI & Portals**: React DOM Portals (`createPortal`), React Icons, React Toastify
- **Charts & Motion**: Recharts, Framer Motion, GSAP
- **Authentication**: `@react-oauth/google`

### Backend

- **Runtime**: Node.js, Express.js 5
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`), bcrypt password hashing
- **Email Delivery**: Nodemailer (Gmail SMTP)
- **Validation**: Validator.js, HTTP Status codes
- **Security**: CORS, Helmet, Sliding Window Rate Limiter

### AI & Speech

- **LLM Engine**: Groq API (Llama 3.3 70B Versatile)
- **Speech Recognition**: Web Speech API (`SpeechRecognition`)
- **Speech Synthesis**: Web Speech API (`SpeechSynthesisUtterance` with Devanagari & Bengali chunking)

---

## 📂 Project Structure

```text
BizPilot-AI/
│
├── Backend/
│   ├── config/           # Database & Groq configuration
│   ├── controllers/      # Auth, Customer, Sale, Task, AI controllers
│   ├── middlewares/      # Auth token & global error handlers
│   ├── models/           # Mongoose data schemas
│   ├── routes/           # REST API endpoint routes
│   ├── services/         # AI prompts & business analytics services
│   ├── utils/            # Email sender, HTML email builders, JWT helpers
│   ├── .env
│   ├── index.js          # Express app entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/   # UI Modal, Buttons, Skeleton Loader, Cards
│   │   ├── context/      # Auth & Store React Context
│   │   ├── layouts/      # Dashboard & Auth Layouts
│   │   ├── pages/        # Login, Register, Forgot/Reset Password, POS, CRM, Tasks, AI
│   │   ├── routes/       # Protected & Public Auth Routes
│   │   └── services/     # API fetch wrapper & Auth service
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mirjaj786/BizPilot-AI-Main.git
cd BizPilot-AI-Main
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key

# Email SMTP Credentials (for Password Reset)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FRONTEND_URL=https://bizpilotcrm.netlify.app
```

### Frontend (`Frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## ▶️ Running Locally

### Start Backend Server

```bash
cd Backend
npx nodemon index.js
```
*Backend runs on `http://localhost:8080`*

### Start Frontend App

```bash
cd Frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📡 Key API Endpoints

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/api/register` | Register new merchant account |
| **Auth** | POST | `/api/login` | Authenticate user & receive JWT |
| **Auth** | POST | `/api/google-login` | Google OAuth 2.0 Single Sign-On |
| **Auth** | POST | `/api/forgot-password` | Send 15-min reset link via SMTP email |
| **Auth** | POST | `/api/reset-password/:token` | Reset user password with token |
| **Auth** | GET | `/api/auth/me` | Fetch logged-in user profile |
| **CRM** | GET/POST | `/api/customers` | Fetch & create CRM customer records |
| **CRM** | POST | `/api/customers/bulk-import` | 1-Click bulk Excel/CSV import |
| **POS** | GET/POST | `/api/sales` | Fetch sales history & checkout orders |
| **Tasks** | GET/POST | `/api/tasks` | Fetch & create operational store tasks |
| **AI** | POST | `/api/ai/chat` | AI Copilot business diagnostics |

---

## 📸 Screenshots

| View | Description |
|---|---|
| **Dashboard Overview** | Real-time sales metrics, store health score & quick action cards |
| **POS Billing Terminal** | Fast checkout terminal with live cart & instant toast notifications |
| **Customer CRM** | Client accounts, address ledgers & soft delete/restore controls |
| **AI Copilot** | Multilingual text & voice business consultant in EN, HI, BN |
| **Password Reset** | Automated email delivery with responsive reset password UI |

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Mirjaj**
- GitHub: [https://github.com/Mirjaj786](https://github.com/Mirjaj786)

---

**Built with ❤️ using React, Node.js, MongoDB, Nodemailer, and Groq AI.**
