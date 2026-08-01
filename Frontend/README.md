# 🎨 BizPilot AI – Frontend

The **BizPilot AI Frontend** is a modern React application built with **React 19**, **Vite**, and **Tailwind CSS**. It provides an intuitive dashboard for managing customers, sales, tasks, business analytics, and AI-powered business insights.

Designed with a clean and responsive user interface, the application focuses on simplicity, performance, and an excellent user experience for small businesses.

---

# ✨ Features

- 🔐 User Authentication (JWT & Google OAuth 2.0)
- 📥 1-Click Excel (.xlsx) & CSV (.csv) Data Migration Hub (`DataImportModal.jsx`)
- 🔄 3-Strategy Duplicate Resolution Selector (Update, Skip, or Create Side-by-Side)
- 📊 Business Dashboard with Real-time Metrics
- 👥 Customer Management with 10-Digit Phone Validation
- 💰 Sales & Billing (POS) Terminal
- 🧾 Invoice Generation & Thermal Receipt Print
- 📤 WhatsApp Invoice Sharing
- 💬 WhatsApp Payment Reminders
- 🤖 AI Business Consultant (Groq LLM)
- 🎙️ Voice Input (Speech-to-Text) & Voice Response
- 📈 Business Analytics & Executive PDF Export
- ✅ Task Management Board
- 🌙 Dark / Light Mode Support (Synced Across Landing & Dashboard)
- 📱 Fully Responsive Design

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State Management | React Context API |
| HTTP Client | Axios |
| Charts | Recharts |
| Animations | Framer Motion, GSAP |
| Icons | React Icons |
| Notifications | React Toastify |

---

# 📂 Project Structure

```text
src/
│
├── assets/              # Images, logos and icons
├── components/          # Reusable UI components
├── context/             # Global Store Context
├── layouts/             # Layout components
├── pages/               # Application pages
├── routes/              # Protected and public routes
├── services/            # API service modules
├── utils/               # Helper functions
├── App.jsx
├── main.jsx
└── index.css
```

---

# 📄 Main Pages

### 🏠 Home

Landing page introducing BizPilot AI and its core features.

---

### 📊 Dashboard

The main business overview page displaying:

- Revenue summary
- Sales statistics
- Customer metrics
- Recent transactions
- Business insights
- AI Store Health Scanner

---

### 💰 Sales

Point-of-Sale (POS) system where users can:

- Create sales
- Generate invoices
- Print receipts
- Share invoices via WhatsApp

---

### 👥 Customers

Manage customer information including:

- Purchase history
- Outstanding dues
- Customer details
- WhatsApp payment reminders

---

### ✅ Tasks

Organize daily business operations with:

- Create tasks
- Update task status
- Priority management
- Delete completed tasks

---

### 🤖 AI Business Consultant

An AI-powered assistant capable of:

- Business analysis
- Sales analysis
- Weekly reports
- Customer insights
- Business recommendations
- Workflow explanations

Additional AI features include:

- Voice Input (Speech-to-Text)
- Voice Response (Text-to-Speech)
- Streaming AI responses

---

### 📈 Analytics

Provides visual business insights including:

- Revenue trends
- Sales charts
- Customer analytics
- PDF report generation

---

# 🎙️ AI Features

BizPilot AI includes several intelligent features designed to improve business productivity.

### Voice Input

Users can speak directly to the AI using the browser's Speech Recognition API.

---

### Voice Response

The AI can read responses aloud using the browser's Text-to-Speech API.

---

### Business Analysis

The AI analyzes business data and provides:

- Sales insights
- Customer insights
- Product recommendations
- Business health reports
- Growth suggestions

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd Frontend
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create a `.env` file inside the Frontend directory.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 4. Run the development server

```bash
npm run dev
```

Application URL

```
http://localhost:5173
```

---

## 5. Build for production

```bash
npm run build
```

---

# 🌐 API Integration

The frontend communicates with the backend using a centralized Axios instance.

Features include:

- Automatic JWT token attachment
- Shared API configuration
- Centralized request handling
- Simplified service modules

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

# 🚀 Future Improvements

Possible future enhancements include:

- Push Notifications
- Offline Support
- Inventory Management
- Multi-user Roles
- Email Notifications
- Customer Loyalty Program
- AI Sales Forecasting
- Store Health Dashboard Improvements

---

# 📄 Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Backend API URL |

---

# 📦 Build

Development

```bash
npm run dev
```

Production

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

Developed as part of the **BizPilot AI** project.