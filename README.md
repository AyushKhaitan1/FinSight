# 💎 FinSight - Personal Finance Command Center

FinSight is a premium, full-stack financial management platform designed to provide users with a real-time, AI-powered overview of their net worth, spending habits, and investment portfolio. 

**Live Demo:** [https://finsight-frontend-mffn.onrender.com](https://finsight-frontend-mffn.onrender.com)

---

## ✨ Features

### 📊 Comprehensive Dashboard
- **Net Worth Tracking:** Real-time calculation of assets minus liabilities.
- **Visual Analytics:** Interactive charts (Area & Bar) for monthly income vs. expenses.
- **AI Forecasting:** Predictive insights into end-of-month balances based on spending velocity.

### 💰 Transaction Management
- **Manual Logging:** Easy entry for income and expenses.
- **OCR Receipt Scanning:** Extract transaction data automatically from images (Powered by Tesseract.js).
- **Categorization:** Automatic grouping of expenses (Food, Housing, Entertainment, etc.).

### 📈 Portfolio & Wealth
- **Asset Allocation:** Track Mutual Funds, Stocks, Bank Balances, and more.
- **SIP Automation:** Schedule and track Systematic Investment Plans with automatic transaction logging.
- **Return Analysis:** Visual tracking of invested vs. current value with percentage gain/loss.

### 🤖 FinSight AI Assistant
- **Natural Language Querying:** Ask questions like "How much did I spend on food this month?" or "What's my biggest expense?"
- **Local Analysis:** High-performance financial engine that analyzes your data without needing external tokens.

### 🌗 Premium UI/UX
- **Dynamic Dark Mode:** Sleek, glassmorphic interface optimized for low-light environments.
- **Mobile First:** Fully responsive design that works flawlessly on Phones, Tablets, and Desktops.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Recharts** (Data Visualization)
- **Zustand** (State Management)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **JWT & Bcryptjs** (Secure Authentication)
- **Node-Cron** (SIP Automation)

---

## 🚀 Local Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/AyushKhaitan1/FinSight.git
cd FinSight
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5001
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Update services/api.ts to point to http://localhost:5001/api/v1
npm run dev
```

---

## 🌍 Production Deployment

### Backend (Render/Railway)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment Variables:** `MONGODB_URI`, `JWT_SECRET`, `PORT=10000`

### Frontend (Render/Vercel)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** `VITE_API_URL` (Link to your live backend)

---

## 🔒 Security
- **JWT Bearer Authentication:** All private routes are protected by robust middleware.
- **CORS Lockdown:** Backend strictly restricted to authorized frontend origins.
- **Helmet.js:** Implementation of security headers to prevent common web vulnerabilities.

---

## 🤝 Contributing
Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License
[ISC](https://opensource.org/licenses/ISC)

Created with ❤️ by Ayush Khaitan.
