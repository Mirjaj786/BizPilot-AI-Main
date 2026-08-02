# ⚡ BizPilot AI – Backend API

The **BizPilot AI Backend** is a high-performance RESTful API built with **Node.js**, **Express.js**, and **MongoDB**. It powers the core operations of the BizPilot AI business management OS, including authentication, password recovery via SMTP email, customer CRM management, POS sales transactions, operational tasks, and AI-driven business intelligence using the Groq AI API.

The backend follows a clean **MVC architecture** with reusable services, middlewares, and utilities to ensure code modularity, security, and scalability.

---

## ✨ Key Features

- 🔐 **JWT & Google OAuth 2.0 Single Sign-On**: Secure token-based authentication (`/api/login`, `/api/google-login`).
- 📧 **Automated Password Reset Flow**: 15-minute expiring JWT tokens delivered via Nodemailer HTML emails (`/api/forgot-password`, `/api/reset-password/:token`).
- 🌐 **Dynamic Frontend Link Generation**: Auto-detects client origin headers to generate matching reset links for local and production deployments.
- 📥 **Bulk Customer Data Import API**: High-speed batch processing via Mongoose `bulkWrite` (`POST /api/customers/bulk-import`).
- 🔄 **3-Strategy Duplicate Engine**: Choose to Update profiles, Skip duplicates, or Create side-by-side records.
- 👥 **Customer CRM**: Phone number validation, status toggle (Soft Delete / Restore / Permanent Delete), and dues breakdown.
- 💰 **POS & Sales Management**: Transaction processing, automatic invoice number generation, and sales statistics.
- ✅ **Operational Task Board**: Store task creation, priority assignment, and completion tracking.
- 🤖 **Executive AI Consultant**: Groq LLM integration (Llama 3.3 70B) for instant business performance analysis.
- 🌐 **Multilingual AI Prompt Service**: System prompt engine providing localized insights in **English**, **Hindi (हिंदी)**, and **Bengali (বাংলা)**.
- 🛡️ **Sliding Window Token Rate Limiter**: Rate-limiting middleware (`rateLimiter.js`) protecting AI endpoints (10 req/min).
- ⚠️ **Centralized Error Handling**: Standardized `ApiError` and `ApiResponse` wrappers with Express error handling middleware.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express.js 5 |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JWT (`jsonwebtoken`), bcrypt password hashing |
| **Google Auth** | `google-auth-library` (OAuth 2.0) |
| **Email Delivery** | Nodemailer (Gmail / Custom SMTP) |
| **AI Integration** | Groq API (`groq-sdk`, Llama 3.3 70B) |
| **Security** | Helmet, CORS |
| **Validation** | Validator.js |
| **Environment** | dotenv |

---

## 📂 Backend Architecture

```text
Backend/
│
├── config/
│   ├── database.js       # MongoDB Mongoose connection
│   └── groq.js           # Groq AI client configuration
│
├── controllers/
│   ├── aiController.js        # AI chat & diagnostic handlers
│   ├── customerController.js  # CRM CRUD & bulk import handlers
│   ├── saleController.js      # POS checkout & sales handlers
│   ├── taskController.js      # Store task management handlers
│   └── userController.js      # Auth, Google SSO & Password reset handlers
│
├── middlewares/
│   ├── authMiddleware.js # JWT verification middleware
│   ├── errorHandler.js   # Centralized Express error handler
│   └── rateLimiter.js    # Sliding window API rate limiter
│
├── models/
│   ├── customerModel.js  # Customer CRM schema
│   ├── saleModel.js      # Sales transaction schema
│   ├── taskModel.js      # Operational task schema
│   └── userModel.js      # Merchant user schema
│
├── routes/
│   ├── aiRoute.js        # /api/ai endpoints
│   ├── customerRoute.js  # /api/customers endpoints
│   ├── saleRoute.js      # /api/sales endpoints
│   ├── taskRoute.js      # /api/tasks endpoints
│   └── userRoute.js      # /api auth & user endpoints
│
├── services/
│   ├── aiServices.js               # Groq LLM API caller & offline fallbacks
│   ├── businessContextService.js   # Live DB metrics aggregator
│   └── promptService.js            # Executive AI prompt builder
│
├── utils/
│   ├── apiError.js         # Custom error class wrapper
│   ├── apiResponse.js      # Standardized JSON response formatter
│   ├── asyncHandler.js     # Async controller wrapper
│   ├── buildResetEmail.js  # Responsive HTML password reset email builder
│   ├── createToken.js      # JWT token signer helper
│   ├── invoiceGenerate.js  # Auto invoice number generator
│   └── sendEmail.js        # Nodemailer SMTP email transporter
│
├── .env
├── index.js              # Express application server entry point
├── package.json
└── vercel.json           # Vercel serverless deployment config
```

---

## ⚙️ Installation & Setup

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `Backend` directory:

```env
PORT=8080
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/BizPilot_AI
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=gsk_your_groq_api_key

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_google_client_id

# SMTP Email Configuration (Password Reset)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FRONTEND_URL=https://bizpilotcrm.netlify.app
```

### 3. Run the Server

**Development Mode (Nodemon):**
```bash
npx nodemon index.js
```

**Production Mode:**
```bash
npm start
```

*Server listens on `http://localhost:8080`*

---

## 📡 REST API Reference

### Authentication & Account

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/register` | Public | Register new merchant account |
| **POST** | `/api/login` | Public | Login with email & password |
| **POST** | `/api/google-login` | Public | Google OAuth 2.0 Single Sign-On |
| **POST** | `/api/forgot-password` | Public | Send password reset link to user's email |
| **POST** | `/api/reset-password/:token` | Public | Reset password using 15-min token |
| **GET** | `/api/auth/me` | Protected | Get authenticated merchant profile |
| **POST** | `/api/logout` | Protected | Logout user session |

---

### Customers (CRM)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **GET** | `/api/customers` | Protected | Fetch all merchant customer records |
| **POST** | `/api/customers` | Protected | Create new customer account |
| **POST** | `/api/customers/bulk-import` | Protected | 1-Click bulk Excel/CSV import |
| **GET** | `/api/customers/search?q=` | Protected | Search customer profiles |
| **PUT** | `/api/customers/:id` | Protected | Update customer details |
| **DELETE** | `/api/customers/:id` | Protected | Soft-delete (deactivate) customer account |
| **PATCH** | `/api/customers/:id/restore` | Protected | Restore soft-deleted customer account |
| **DELETE** | `/api/customers/:id/permanent` | Protected | Permanently delete customer account |

---

### Sales & Invoices

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **GET** | `/api/sales` | Protected | Fetch all sales transactions |
| **POST** | `/api/sales` | Protected | Create POS sale transaction & receipt |
| **GET** | `/api/sales/stats` | Protected | Fetch sales metrics & revenue summaries |
| **GET** | `/api/sales/:id` | Protected | Fetch single transaction details |

---

### Store Tasks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **GET** | `/api/tasks` | Protected | Fetch operational tasks |
| **POST** | `/api/tasks` | Protected | Create new store task |
| **PUT** | `/api/tasks/:id` | Protected | Update task status or details |
| **DELETE** | `/api/tasks/:id` | Protected | Delete task item |

---

### AI Business Consultant

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/ai/chat` | Protected | AI Copilot business chat query (EN, HI, BN) |

---

## 🔒 Security Practices

- **JWT Token Verification**: Protected endpoints verify JWT signature via `authMiddleware.js`.
- **Password Security**: Passwords are hashed using bcrypt with salt rounds = 10.
- **Email Reset Expiration**: Password reset tokens expire in 15 minutes and require valid JWT signature.
- **CORS Protection**: Restricted origin list allowing Netlify production and local dev origins.
- **Rate Limiting**: AI routes restricted to 10 requests per minute per IP.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Mirjaj** – Part of the **BizPilot AI** Project.