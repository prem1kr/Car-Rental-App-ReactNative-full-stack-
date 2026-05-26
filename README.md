# 🚗 DriveNow - Car Rental Application
DriveNow is a full-stack car rental mobile application built using React Native (Expo), Node.js, Express.js, MongoDB, Redux Toolkit, Socket.IO, and Cloudinary.

The application allows users to browse cars, rent vehicles, make bookings, communicate with support in real time, and manage their profiles.  
Admins can manage cars, users, bookings, analytics, and live customer chats through a powerful dashboard.

---

# ✨ Features

## 👤 User Features

- User Authentication (Login / Register)
- JWT Authentication & Secure Sessions
- Role-Based Access Control
- Browse Available Cars
- Search & Filter Cars
- Car Booking System
- Real-Time Booking Updates
- Booking History
- User Profile Management
- Refer & Earn System
- Real-Time Chat Support
- Current Location Access
- Responsive & Modern UI

---

## 💬 Real-Time Chat Support

- WebSocket-Based Communication
- Live Admin ↔ User Chat
- Instant Messaging
- Socket.IO Integration
- Real-Time Updates
- Persistent Socket Connections

---

## 🛠️ Admin Features

- Admin Dashboard
- Revenue Analytics
- Dynamic Charts
- Booking Management
- Car Management
- User Management
- Revenue Tracking
- Dynamic Activity Feed
- Live Chat Monitoring
- Real-Time Statistics

---

# ☁️ Cloudinary Integration

DriveNow uses Cloudinary for image storage and optimization.

### Features

- Car Image Upload
- Cloud-Based Media Storage
- Optimized Image Delivery
- Secure Image Hosting
- Fast CDN Performance

---

# 📊 Dashboard Analytics

- Revenue Trend Chart
- Weekly Booking Overview
- Recent Activity Feed
- Total Users
- Total Revenue
- Total Bookings
- Active Cars

---

# 🧰 Tech Stack

## 📱 Frontend

- React Native
- Expo
- Expo Router
- Redux Toolkit
- Axios
- AsyncStorage
- React Navigation
- React Native Chart Kit
- React Native Maps
- Google Places Autocomplete
- Expo Location
- Expo Image Picker
- Expo Linear Gradient
- Socket.IO Client

---

## ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Socket.IO
- Nodemailer
- CORS
- dotenv

---

# 📦 Frontend Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-native-clipboard/clipboard": "^1.16.3",
  "@react-native-community/datetimepicker": "8.4.4",
  "@react-navigation/bottom-tabs": "^7.4.0",
  "@react-navigation/elements": "^2.6.3",
  "@react-navigation/native": "^7.1.8",
  "@reduxjs/toolkit": "^2.11.2",
  "axios": "^1.16.0",
  "expo": "~54.0.33",
  "expo-image-picker": "^55.0.20",
  "expo-linear-gradient": "~15.0.8",
  "expo-location": "~19.0.8",
  "expo-router": "~6.0.23",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-chart-kit": "^6.12.2",
  "react-native-google-places-autocomplete": "^2.6.4",
  "react-native-maps": "1.20.1",
  "react-redux": "^9.2.0",
  "socket.io-client": "^4.8.3"
}
````

---

# 📦 Backend Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.6.1",
  "nodemailer": "^8.0.7",
  "socket.io": "^4.8.3"
}
```

---

# 📂 Project Structure

```bash
CAR RENTAL APP
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── socket
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── myapp
│   ├── app
│   │   ├── (tabs)
│   │   ├── admin
│   │   │   ├── (tabs)
│   │   │   └── pages
│   │   ├── pages
│   │   ├── _layout.jsx
│   │   ├── index.jsx
│   │   └── welcome.jsx
│   │
│   ├── assets
│   ├── components
│   ├── data
│   ├── features
│   ├── hooks
│   ├── redux
│   ├── android
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
└── README.md
```

---
## 1️⃣ Clone Repository

```bash
git clone https://github.com/prem1kr/Car-Rental-App-ReactNative-full-stack-.git
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../myapp
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
GOOGLE_MAP_API
```

---

# ▶️ Run Backend

```bash
cd backend
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# ▶️ Run Frontend

```bash
cd myapp
npx expo start
```

---

# 🔑 Authentication Flow

* JWT Token Authentication
* Secure Password Hashing
* AsyncStorage Session Persistence
* Role-Based Navigation
* Admin/User Access Control

---

# 💬 Real-Time Communication

DriveNow includes a real-time customer support chat system powered by WebSockets.

### Features

* Instant Messaging
* Live Customer Support
* Persistent Socket Connections
* Fast Real-Time Updates
* Admin & User Communication

---

# ☁️ Image Upload System

Cloudinary is used for:

* Car Image Uploads
* Secure Media Storage
* CDN-Based Delivery
* Optimized Image Compression
* Fast Image Rendering

---

# 📦 API Modules

* Authentication APIs
* User APIs
* Car APIs
* Booking APIs
* Payment APIs
* Referral APIs
* Chat APIs
* Reveiews APIs
* Notifications APIs
* Profiles APIs


---

# 📍 Maps & Location Features

* Google Places Autocomplete
* User Current Location
* Interactive Maps
* Pickup & Drop Location Support

---

# 🚀 Future Improvements

* Online Payment Gateway
* Push Notifications
* AI-Based Car Recommendations
* Live Vehicle Tracking
* Multi-Language Support
* Dark Mode
* Voice Search
* Booking Reminders
* SMTP Auth
---

# 👨‍💻 Developer

## Prem Kumar

* Full Stack Web And Mobile App Developer

