# ⚡ BizPilot AI – Backend

The **BizPilot AI Backend** is a RESTful API built with **Node.js**, **Express.js**, and **MongoDB**. It powers the core functionality of the BizPilot AI CRM, including authentication, customer management, sales, task management, and AI-powered business analysis using the Groq API.

The backend follows a clean MVC architecture with reusable services, middleware, and utility functions to keep the code modular, maintainable, and easy to extend.

---

# ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 👥 Customer Management
- 💰 Sales & Invoice Management
- ✅ Task Management
- 🤖 AI Business Consultant (Groq AI)
- 📊 Business Analytics & Insights
- 📄 Automatic Invoice Number Generation
- 🛡️ Protected API Routes
- ⚠️ Global Error Handling
- 📦 MongoDB Data Storage

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| AI Integration | Groq API (OpenAI SDK) |
| Security | Helmet, CORS |
| Validation | Validator.js |
| Environment | dotenv |

---

# 📂 Project Structure

```text
Backend/
│
├── config/
│   ├── database.js
│   └── groq.js
│
├── controllers/
│   ├── aiController.js
│   ├── customerController.js
│   ├── saleController.js
│   ├── taskController.js
│   └── userController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── models/
│   ├── customerModel.js
│   ├── saleModel.js
│   ├── taskModel.js
│   └── userModel.js
│
├── routes/
│   ├── aiRoute.js
│   ├── customerRoute.js
│   ├── saleRoute.js
│   ├── taskRoute.js
│   └── userRoute.js
│
├── services/
│   ├── aiServices.js
│   ├── businessContextService.js
│   └── promptService.js
│
├── utils/
│   ├── apiError.js
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   ├── createToken.js
│   └── invoiceGenerate.js
│
├── .env
├── index.js
└── package.json
```

---

# 🏗️ Architecture

The backend follows a simple layered **MVC architecture**.

### Routes

Defines API endpoints and applies middleware before forwarding requests to controllers.

### Controllers

Handle incoming requests, validate input, and return API responses.

### Models

Define MongoDB collections using Mongoose schemas with built-in validation.

### Services

Contain reusable business logic such as AI communication and business data analysis.

### Middlewares

Handle authentication, authorization, and centralized error handling.

### Utils

Reusable helper functions including JWT generation, invoice generation, API response formatting, and async wrappers.

---

# ⚙️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the Backend folder.

```env
PORT=8080

MONGODB_URI=mongodb://127.0.0.1:27017/bizflow

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

### 4. Start the server

Development

```bash
npx nodemon index.js
```

Production

```bash
npm start
```

The backend will run on

```
http://localhost:8080
```

---

# 🔐 Authentication Flow

```text
Register
      │
      ▼
Login
      │
      ▼
Receive JWT Token
      │
      ▼
Access Protected Routes
```

Include the JWT token in the Authorization header.

```http
Authorization: Bearer <your_token>
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| GET | `/api/getme` | Get logged-in user |
| POST | `/api/logout` | Logout user |

---

## Customers

| Method | Endpoint |
|---------|----------|
| GET | `/api/customers` |
| POST | `/api/customers` |
| GET | `/api/customers/search?q=` |
| PUT | `/api/customers/:id` |
| DELETE | `/api/customers/:id` |
| PATCH | `/api/customers/:id/restore` |
| DELETE | `/api/customers/:id/permanent` |

---

## Sales

| Method | Endpoint |
|---------|----------|
| GET | `/api/sales` |
| POST | `/api/sales` |
| GET | `/api/sales/stats` |
| GET | `/api/sales/:id` |

---

## Tasks

| Method | Endpoint |
|---------|----------|
| GET | `/api/tasks` |
| POST | `/api/tasks` |
| PUT | `/api/tasks/:id` |
| DELETE | `/api/tasks/:id` |

---

## AI

| Method | Endpoint |
|---------|----------|
| POST | `/api/ai/chat` |

The AI endpoint analyzes your business data and provides intelligent insights, recommendations, and business guidance using Groq AI.

---

# 🤖 AI Features

The AI module can analyze business data and provide insights such as:

- Sales analysis
- Business performance summary
- Customer insights
- Weekly sales review
- Product performance
- Revenue analysis
- Business recommendations
- Workflow explanation

---

# 🔒 Security

The backend includes several security measures:

- JWT Authentication
- Password hashing using bcrypt
- Protected routes
- Helmet security headers
- CORS protection
- Input validation using Validator.js

---

# 📌 Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT |
| GROQ_API_KEY | Groq AI API key |

---

# 🚀 Future Improvements

Possible future enhancements include:

- Product Management Module
- Inventory Notifications
- Email Notifications
- WhatsApp Payment Reminders
- AI Sales Forecasting
- Store Health Score
- Dashboard Caching
- Role-Based Access Control (RBAC)

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

Developed as part of the **BizPilot AI** CRM project.