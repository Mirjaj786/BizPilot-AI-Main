# 🚀 BizPilot AI

> An AI-powered CRM and Point of Sale (POS) system built for small retail businesses.

BizPilot AI helps shop owners manage customers, sales, invoices, daily tasks, and business analytics from one place. It also includes an AI Business Consultant that analyzes business data and provides smart recommendations through both text and voice.

---

## ✨ Features

- 🔐 Secure JWT & Google OAuth 2.0 Single Sign-On
- 📥 1-Click Excel (.xlsx) & CSV (.csv) Data Migration Engine
- 🔄 Smart Duplicate Resolution Selector (Update, Skip, or Create Side-by-Side)
- 👥 Customer CRM with 10-Digit Phone Validation
- 💰 Point of Sale (POS) Billing Terminal
- 🧾 Thermal & Digital Invoice Generation
- 📤 WhatsApp Invoice Sharing
- 💬 WhatsApp Payment Reminders
- 🤖 AI Business Consultant (Groq LLM)
- 🎙️ Voice Input Speech-to-Text Copilot
- 🔊 Voice Response Text-to-Speech Assistant
- 📊 AI Store Health Scanner
- 🛡️ AI Rate Limiting API Protection (10 req/min)
- 📈 Real-time Business Analytics Dashboard
- 📄 Executive PDF Financial Report Export
- ✅ Task Management Board
- 🌙 Seamless Dark / Light Mode Support
- 📱 Fully Responsive Cross-Platform Design

---

## 🤖 AI Features

BizPilot AI includes an AI assistant that can:

- Analyze business performance
- Review sales and revenue
- Identify top customers
- Suggest ways to increase sales
- Explain business workflow
- Analyze weekly sales
- Generate business insights
- Answer business-related questions
- Respond using voice

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Recharts
- Framer Motion
- GSAP
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Validator.js

### AI

- Groq API (Llama 3.3 70B)
- Web Speech API

---

## 📂 Project Structure

```text
BizPilot-AI/
│
├── Backend/          # Express REST API
├── Frontend/         # React Application
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mirjaj786/BizPilot-AI-Main.git

cd BizPilot-AI-Main
```

---

### 2. Install Backend

```bash
cd Backend

npm install
```

---

### 3. Install Frontend

```bash
cd ../Frontend

npm install
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)

```env
PORT=8080

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

### Frontend (`Frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd Backend

npm start
```

Development

```bash
npx nodemon index.js
```

Backend runs on

```
http://localhost:8080
```

---

### Start Frontend

```bash
cd Frontend

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## 📸 Screenshots

> Replace these images with your own project screenshots.

| Page | Preview |
|------|---------|
| Dashboard | `assets/dashboard.png` |
| Sales | `assets/sales.png` |
| Customers | `assets/customers.png` |
| AI Assistant | `assets/ai.png` |
| Analytics | `assets/analytics.png` |

---

## 📁 Documentation

For more details, check the project documentation:

- 📘 **Backend Documentation:** `Backend/README.md`
- 📗 **Frontend Documentation:** `Frontend/README.md`

---

## 🚀 Future Improvements

- Inventory Management
- Low Stock Alerts
- Customer Due Notifications
- AI Sales Forecasting
- Barcode Scanner
- Multi-user Roles
- Mobile Application
- WhatsApp Business API Integration

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Mirjaj**

GitHub: https://github.com/Mirjaj786

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

**Built with ❤️ using React, Node.js, MongoDB, and Groq AI.**