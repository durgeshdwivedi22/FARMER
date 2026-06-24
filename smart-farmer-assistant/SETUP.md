# 🌾 Smart Farmer Assistant - Complete Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Installation Guide](#installation-guide)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Features](#features)
8. [API Endpoints](#api-endpoints)
9. [Deployment Instructions](#deployment-instructions)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Smart Farmer Assistant** is a production-ready mobile-first web application designed specifically for Indian farmers to:
- Track expenses, profits, and losses
- Get AI-powered crop recommendations
- Receive weather-based farming advice
- Use voice-to-text for hands-free operation
- Access actionable farming insights

**Tech Stack:**
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **APIs:** OpenWeatherMap (optional), Web Speech API

---

## 📦 Prerequisites

Before starting, ensure you have:

### Required:
- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** (v8+) or **yarn**
- **MongoDB** (v4.4+) - [Download Community Edition](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional)

### Recommended:
- Visual Studio Code
- MongoDB Compass (for database visualization)
- Postman (for API testing)

---

## 📂 Project Structure

```
smart-farmer-assistant/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Login.jsx           # Authentication
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Expenses.jsx        # Expense tracker
│   │   │   ├── Crops.jsx           # Crop management
│   │   │   ├── Weather.jsx         # Weather info
│   │   │   ├── VoiceAssistant.jsx  # Voice input
│   │   │   └── Insights.jsx        # Smart insights
│   │   ├── components/             # Reusable components
│   │   │   ├── Layout.jsx          # Header, Sidebar, Navigation
│   │   │   └── ui.jsx              # Button, Card, Input, etc.
│   │   ├── services/
│   │   │   └── api.js              # API client
│   │   └── utils/
│   │       ├── translation.js      # Hindi/English support
│   │       └── voiceInput.js       # Voice recognition
│   ├── package.json
│   ├── .env.example
│   └── vite.config.js
│
├── server/                          # Node.js Backend
│   ├── models/                      # Database models
│   │   ├── Farmer.js              # Farmer data
│   │   ├── Crop.js                # Crop tracking
│   │   └── Expense.js             # Expense tracking
│   ├── routes/                      # API endpoints
│   │   ├── farmer.js              # Auth & profile
│   │   ├── expense.js             # Expense CRUD
│   │   ├── crop.js                # Crop management
│   │   ├── weather.js             # Weather data
│   │   └── insights.js            # Smart insights
│   ├── utils/
│   │   ├── cropRecommendation.js  # AI crop logic
│   │   └── insightsGenerator.js   # Insight analysis
│   ├── index.js                     # Main server file
│   ├── package.json
│   └── .env.example
│
├── README.md                        # Main documentation
├── SETUP.md                         # This file
└── package.json                     # Root package.json
```

---

## 🚀 Installation Guide

### Step 1: Clone/Download the Project

```bash
# If using Git
git clone <repository-url>
cd smart-farmer-assistant

# If you have the folder already, just navigate to it
cd smart-farmer-assistant
```

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

This will install:
- express
- mongoose
- cors
- jsonwebtoken
- bcryptjs
- axios
- dotenv
- nodemon (dev)

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

This will install:
- react
- react-dom
- axios
- tailwindcss
- vite
- recharts (for charts)

### Step 4: Back to Root

```bash
cd ..
```

---

## ⚙️ Configuration

### Server Configuration (.env)

Create `server/.env` file:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/smart-farmer
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-farmer

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_in_production_123456789

# Weather API (Optional)
OPENWEATHER_API_KEY=your_openweather_key

# Client URL
CLIENT_URL=http://localhost:3000
```

**Get WeatherAPI Key (Optional):**
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free
3. Get your API key from [API keys page](https://home.openweathermap.org/api_keys)
4. Add to `.env`

### Client Configuration (.env)

Create `client/.env` file:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Farmer Assistant
```

### MongoDB Setup

**Option A: Local MongoDB**

```bash
# Windows (in Command Prompt as Admin)
mongod

# macOS/Linux
brew services start mongodb-community

# Or start MongoDB manually
mongod --dbpath /path/to/data
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free account available)
3. Create a cluster
4. Get connection string
5. Add to `server/.env` as `MONGODB_URI`

---

## ▶️ Running the Application

### Option 1: Run Both Services from Root (Recommended)

```bash
# From project root directory
npm run dev
```

This uses concurrently to run both:
- **Client:** http://localhost:3000 (Vite dev server)
- **Server:** http://localhost:5000 (Express API)

### Option 2: Run Separately

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

### Verify Installation

1. **API Health Check:**
   ```
   http://localhost:5000
   ```
   Should return:
   ```json
   {
     "message": "Smart Farmer Assistant API is running! 🌾",
     "status": "active"
   }
   ```

2. **Frontend:**
   ```
   http://localhost:3000
   ```
   Should show the login page

3. **Demo Account:**
   - 📱 Mobile: `9876543210`
   - 🔐 OTP: `123456`

---

## ✨ Features

### 1. **📊 Dashboard**
- Financial summary (investment, profit, loss)
- Farm statistics
- Smart insights
- Recent transactions

### 2. **💰 Expense Tracker**
- Manual expense entry
- Voice input support
- Categorized tracking
- History and analytics

### 3. **🌾 Crop Management**
- Track current crops
- AI-powered crop recommendations
- Seasonal advice
- Profit estimations

### 4. **🌤️ Weather Integration**
- Real-time weather data
- Farming-specific advice
- Water requirement calculation
- Pest risk assessment

### 5. **🎤 Voice Assistant**
- Speech-to-text input
- Automatic expense detection
- Hindi language support
- Hands-free operation

### 6. **💡 Smart Insights**
- Financial analysis
- Expense optimization suggestions
- Crop performance insights
- Seasonal recommendations

### 7. **🌐 Multi-Language**
- Hindi (default)
- English
- Easy toggle in header

---

## 📡 API Endpoints

### Authentication Routes
```
POST   /api/farmer/register     - Register new farmer
POST   /api/farmer/login        - Request OTP
POST   /api/farmer/verify-otp   - Verify OTP and login
GET    /api/farmer/profile      - Get farmer profile
PUT    /api/farmer/profile      - Update profile
GET    /api/farmer/summary      - Get financial summary
```

### Expense Routes
```
POST   /api/expense             - Add expense
GET    /api/expense             - Get all expenses
GET    /api/expense/:id         - Get single expense
PUT    /api/expense/:id         - Update expense
DELETE /api/expense/:id         - Delete expense
```

### Crop Routes
```
POST   /api/crop                - Add crop
POST   /api/crop/recommend      - Get crop recommendations
GET    /api/crop                - Get all crops
PUT    /api/crop/:id            - Update crop
DELETE /api/crop/:id            - Delete crop
```

### Weather Routes
```
GET    /api/weather             - Get current weather
GET    /api/weather/insights/:location - Get detailed insights
```

### Insights Routes
```
GET    /api/insights            - Get all insights
GET    /api/insights/category/:category - Get category insights
```

---

## 🌍 Deployment Instructions

### Deployment to Vercel (Frontend)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <github-repo-url>
   git push -u origin main
   ```

2. **Deploy Frontend:**
   - Go to [vercel.com](https://vercel.com)
   - Connect GitHub account
   - Select repository
   - Set `VITE_API_BASE_URL` environment variable
   - Deploy

### Deployment to Heroku (Backend)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Deploy Server:**
   ```bash
   cd server
   heroku create smart-farmer-api
   git push heroku main
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI=<your-mongodb-uri>
   heroku config:set JWT_SECRET=<your-secret>
   heroku config:set CLIENT_URL=<your-vercel-url>
   ```

### Alternative: Docker Deployment

Create `Dockerfile` in server:

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t smart-farmer-api .
docker run -p 5000:5000 smart-farmer-api
```

---

## 🔧 Troubleshooting

### Issue: "MongoDB connection error"

**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP: [MongoDB Atlas Networking](https://docs.atlas.mongodb.com/security-whitelist/)

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port
lsof -i :5000    # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>    # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: "CORS error"

**Solution:**
- Ensure `CLIENT_URL` in server `.env` matches your frontend URL
- Verify CORS configuration in `server/index.js`

### Issue: "Web Speech API not supported"

**Solution:**
- Use Chrome, Edge, or Safari
- Voice feature requires HTTPS in production
- Gracefully falls back to manual input

### Issue: "Build fails"

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 Support & Resources

- **Frontend Framework:** [React Docs](https://react.dev)
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com)
- **Build Tool:** [Vite](https://vitejs.dev)
- **Backend Framework:** [Express.js](https://expressjs.com)
- **Database:** [MongoDB Docs](https://docs.mongodb.com)

---

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🎉 You're All Set!

Your Smart Farmer Assistant is now ready to use. Visit `http://localhost:3000` and start using the app with the demo account.

**Happy Farming! 🌾**
