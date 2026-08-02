# 🎨 BizPilot AI – Frontend Application

The **BizPilot AI Frontend** is a state-of-the-art Single Page Application (SPA) built with **React 19**, **Vite**, and **Tailwind CSS v4**. It provides an intuitive, high-performance workspace for retail merchants to manage point-of-sale billing, customer ledgers, daily store tasks, financial reports, and AI business diagnostics.

Designed with modern glassmorphism aesthetics, dynamic dark/light modes, micro-animations, and full mobile-first responsiveness.

---

## ✨ Features & Highlights

- 🔐 **Authentication & Password Recovery**: Secure JWT Authentication, Google OAuth 2.0 Single Sign-On, and Email Password Reset flow (`ForgotPassword.jsx`, `ResetPassword.jsx`).
- 💳 **1-Click Transaction Status Updates**: Mark pending due sales as **Paid** directly from Sales History, Dashboard Recent Transactions, or Customer Ledgers with instant real-time revenue recalculation.
- 🌐 **Native Multilingual AI Copilot**: Text and hands-free Voice AI Copilot in **English 🇬🇧**, **Hindi 🇮🇳 (हिंदी)**, and **Bengali 🇧🇩 (বাংলা)**.
- 🎙️ **Voice Speech-to-Text & TTS Assistant**: Speech recognition & sentence-chunked speech synthesis handling English punctuation and Devanagari/Bengali Danda (`।`).
- 📊 **Dynamic AI Store Health Scanner**: Live 0-100 Store Health Score formula based on Cash Settlement Ratio (40%), Credit Exposure Risk (40%), and Task Completion (20%).
- 🪟 **React Portal Modals (`createPortal`)**: Viewport-centered modals with sticky action footers pinned at the bottom on mobile screens.
- 💀 **Animated Shimmer Skeleton Loaders**: `TableSkeleton`, `CardSkeleton`, and `StatSkeleton` components replacing generic loading text.
- 📥 **1-Click Bulk Data Migration Hub**: Import Excel (`.xlsx`) & CSV (`.csv`) ledgers with a 3-strategy duplicate resolution engine (Update, Skip, or Create Side-by-Side).
- 💰 **POS Billing Terminal**: Fast checkout with live cart state, discount controls, and double-click prevention loaders.
- 🧾 **Digital & Thermal Invoices**: Official printable invoice receipts with custom shop details.
- 💬 **WhatsApp Commerce**: 1-Click WhatsApp invoice sharing & payment reminder statements.
- 📈 **Executive Analytics & PDF Exports**: Visual revenue trends and 1-click corporate financial summary PDF exports.
- ✅ **Store Task Board**: Prioritized task management with due dates, assignees, and status toggles.
- 🌙 **Seamless Dark / Light Mode**: Unified theme engine synced to local storage and HTML root.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4, Vanilla CSS Tokens |
| **Routing** | React Router v7 |
| **State Management** | React Context API (`StoreContext.jsx`) |
| **UI Portals** | React DOM Portals (`createPortal`) |
| **HTTP Client** | Native `apiFetch` wrapper with JWT interceptors |
| **Charts** | Recharts |
| **Animations** | Framer Motion, GSAP |
| **Icons** | React Icons (`react-icons/io5`) |
| **Notifications** | React Toastify |
| **Google Auth** | `@react-oauth/google` |

---

## 📂 Project Structure

```text
Frontend/
│
├── src/
│   ├── assets/              # Images, logos, branding assets
│   ├── components/          # Reusable UI components
│   │   ├── Button/          # Custom button with loading spinner
│   │   ├── Charts/          # Recharts revenue & analytics charts
│   │   ├── Skeleton/        # Table, Card & Stat shimmer loaders
│   │   ├── StatCard/        # Dashboard metric cards
│   │   └── ui/              # Modal, Badge, Card, InvoiceModal, DataImportModal
│   │
│   ├── context/             # StoreContext.jsx (Central React Context)
│   ├── layouts/             # AuthLayout & DashboardLayout
│   ├── pages/               # Application page views
│   │   ├── AI/              # AI Copilot voice & text interface
│   │   ├── analytics/       # Analytics dashboard & PDF export
│   │   ├── customers/       # Customer CRM ledger & purchase history
│   │   ├── dashboard/       # Main overview & Health Diagnostics modal
│   │   ├── forgotPassword/  # Email password reset request page
│   │   ├── home/            # Product landing page
│   │   ├── login/           # User authentication login
│   │   ├── register/        # Merchant signup page
│   │   ├── resetPassword/   # New password submission page
│   │   ├── sales/           # POS Billing terminal & Sales history
│   │   ├── settings/        # Store profile & business configuration
│   │   └── tasks/           # Store task management board
│   │
│   ├── routes/              # Public & Protected Auth Routes
│   ├── services/            # API helpers (api.js, authService.js, salesService.js, etc.)
│   ├── index.css            # Global CSS variables & Tailwind v4 styles
│   └── main.jsx             # React DOM root entry point
│
├── .env
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 Core Page Breakdown

### 🏠 Landing Page (`/`)
Introducing BizPilot AI features, interactive product previews, and authentication CTA buttons.

### 📊 Dashboard (`/dashboard`)
Business overview featuring:
- Real-time gross revenue, sales counts, and total unpaid dues.
- Dynamic AI Store Health Scanner (`0-100` score modal).
- Recent transactions list with 1-click **"Mark Paid"** buttons.
- Quick action cards and active task items.

### 💰 POS Billing & Sales History (`/dashboard/sales`)
- **POS Billing Terminal**: Add items to cart, select customer, apply discounts, choose payment method (`UPI`, `Cash`, `Card`, `Due`), and complete sale.
- **Sales History**: Filterable invoice table with 1-click invoice printing, WhatsApp sharing, and **"Mark Paid"** status update for pending dues.

### 👥 Customer CRM (`/dashboard/customers`)
- Customer profile directory with 10-digit phone validation.
- 1-Click Excel/CSV bulk import with duplicate resolution selector.
- Purchase ledgers and outstanding dues breakdown.
- Account soft delete, restore, and permanent deletion controls.

### 🤖 Multilingual AI Copilot (`/dashboard/ai`)
- Interactive text and voice assistant in **English**, **Hindi**, and **Bengali**.
- Real-time speech recognition input and sentence-chunked voice output.
- Executive business diagnostics (revenue velocity, peak sales days, slow-moving items).

### 🔑 Password Recovery (`/forgot-password` & `/reset-password/:token`)
- Request 15-minute expiring password reset link via Nodemailer SMTP email.
- Secure token validation and new password submission page.

---

## ⚙️ Installation & Development

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Start Development Server

```bash
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 4. Build for Production

```bash
npm run build
```

---

## 🌐 API Resolution & Fetch Service

The frontend uses a clean, centralized `apiFetch` helper ([api.js](file:///c:/Users/mirja/OneDrive/Desktop/BizPilot%20AI/Frontend/src/services/api.js)) for all HTTP requests:

- **Local Auto-Detection**: Routes requests to `http://localhost:8080/api` during local development on `localhost`.
- **Production Resolution**: Routes requests to `https://biz-pilot-ai-main.vercel.app/api` when deployed on Netlify (`https://bizpilotcrm.netlify.app`).
- **Authorization**: Automatically attaches JWT bearer tokens (`Authorization: Bearer <token>`) from `localStorage`.

---

## 📱 Responsive & Accessible UI

- **Viewport Centered Portals**: All modals utilize React Portals to guarantee center placement regardless of page scroll.
- **Sticky Footer Action Bars**: Action buttons stay pinned at the bottom on mobile viewports.
- **Double-Click Prevention**: Interactive buttons feature loading state spinners during asynchronous operations.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Developed as part of the **BizPilot AI** Project.