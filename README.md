PROJECT COMPLETED!!!

# HackXIndia Health Management System

A comprehensive health management platform with a mobile app for patients and a web dashboard for doctors, featuring symptom checking and case management.

## 🚀 Usage & Features

### Mobile App (Patient)
- **Symptom Checker**: Interactive flow to assess symptoms (Powered by MedGemma Local Inference).
- **User Dashboard**: View health metrics, upcoming appointments, and medical history.
- **Guest Access**: Quick demo access without full registration.
- **Profile Management**: Manage personal details and health records.

### Website (Doctor)
- **Doctor Dashboard**: Inbox view of assigned patient cases.
- **Case Review**: Detailed view of patient symptoms and AI-assisted analysis.
- **Authentication**: Secure login for medical professionals.

---

## 🛠️ Tech Stack

### **Mobile App** (`/mobile-app`)
- **Framework**: React Native with [Expo](https://expo.dev) (~54.0)
- **Routing**: Expo Router
- **State Management**: Zustand
- **Language**: TypeScript
- **UI**: Lucide React Native, Expo Linear Gradient

### **Website** (`/website`)
- **Framework**: [Next.js](https://nextjs.org) 16 (App Router)
- **Language**: JavaScript / React 19
- **Auth**: JOSE (JWT), JS-Cookie
- **Styling**: CSP-compatible CSS Modules

### **Backend** (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, Bcrypt
- **Tools**: Nodemon, Dotenv

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (LTS recommended)
- MongoDB running locally or a connection string
- Expo Go app on your phone (or an Android/iOS emulator)

### 1. Backend Setup
The backend powers the authentication and data persistence.

```bash
cd backend
npm install
```

**Environment Variables** (`backend/.env`):
Create a `.env` file in the `backend` folder:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/medassist
JWT_SECRET=your_jwt_secret_key_here
```

**Run Server:**
```bash
npm run dev
# Server runs on http://localhost:5001
```

### 2. Website Setup (Doctor Portal)
The website connects to the backend for doctor authentication and case data.

```bash
cd website
npm install
```

**Environment Variables** (`website/.env.local`):
Create a `.env.local` file in the `website` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
JWT_SECRET=your_jwt_secret_key_here  # Must match backend secret
```

**Run Website:**
```bash
npm run dev
# Website runs on http://localhost:3000
```

### 3. Mobile App Setup (Patient)
The mobile app is configured to use **MedGemma** for local inference, ensuring fast and private symptom analysis directly on the device.

```bash
cd mobile-app
npm install
```

**Run App:**
```bash
npx expo start -c
```
- Scan the QR code with **Expo Go** (Android/iOS).
- Press `w` to run in the web browser (limited functionality).

---

## 🧩 Project Structure

```
HackXIndia-Hackathon-2026/
├── backend/            # Express.js API Server
│   ├── config/         # DB connection
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   └── server.js       # Entry point
├── mobile-app/         # Expo React Native App
│   ├── app/            # Expo Router screens
│   ├── components/     # Reusable UI components
│   ├── stores/         # Zustand state
│   └── services/       # AI Service (MedGemma)
└── website/            # Next.js Doctor Dashboard
    ├── app/            # App Router pages
    ├── context/        # Auth Context
    └── lib/            # Auth utilities
```

## 🤖 AI & Privacy
- **MedGemma Integration**: The mobile app utilizes Google's **MedGemma** model for on-device symptom analysis.
- **Local Inference**: All health data processing happens locally on the user's device, ensuring maximum privacy and zero latency.
- **Gemini**: Used for advanced medical query resolution where cloud connectivity is available.
