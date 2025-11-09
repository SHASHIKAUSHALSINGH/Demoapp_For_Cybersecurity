# 🔐 NoSQL Injection Demo App

An educational cybersecurity demonstration showing NoSQL injection vulnerabilities and their fixes using Next.js and Node.js.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-green)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.3-brightgreen)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Demo Instructions](#demo-instructions)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This is an educational project demonstrating:

- ✅ **NoSQL Injection Vulnerability** - How attackers bypass authentication
- ✅ **Security Fixes** - Proper input validation and sanitization
- ✅ **Full-Stack Authentication** - JWT-based login system
- ✅ **Modern UI** - Next.js with shadcn/ui components
- ✅ **Dark Mode** - Complete theme switching support

**⚠️ WARNING:** This contains intentionally vulnerable code for educational purposes. Never deploy the vulnerable endpoints to production!

---

## 📦 Prerequisites

Before running this application, make sure you have the following installed:

### Required Software:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation:

```powershell
node --version    # Should show v18+
npm --version     # Should show v9+
mongod --version  # Should show v5+
git --version     # Should show v2+
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```powershell
git clone https://github.com/SHASHIKAUSHALSINGH/Demoapp_For_Cybersecurity.git
cd Demoapp_For_Cybersecurity
```

### Step 2: Install Frontend Dependencies

```powershell
npm install
```

### Step 3: Install Backend Dependencies

```powershell
cd server
npm install
cd ..
```

### Step 4: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**

```powershell
# If MongoDB is installed as a service, it should already be running
# To check, run:
mongosh

# If not running, start it manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Mac/Linux:**

```bash
# Start MongoDB service
sudo systemctl start mongod

# Or use homebrew (Mac):
brew services start mongodb-community
```

### Step 5: Configure Environment Variables

The backend already has a `.env` file in the `server/` directory. Verify it contains:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/demoapp
JWT_SECRET=super-secret-change-me
CORS_ORIGIN=http://localhost:3000
```

**Optional:** You can change the `JWT_SECRET` to any random string for security.

---

## ▶️ Running the Application

You need to run **two servers** - Frontend and Backend.

### Option 1: Using Two Terminals (Recommended)

**Terminal 1 - Backend Server:**

```powershell
cd server
npm run dev
```

✅ Backend will run on: **http://localhost:4000**

**Terminal 2 - Frontend Server:**

```powershell
# Open a new terminal in the project root
npm run dev
```

✅ Frontend will run on: **http://localhost:3000**

### Option 2: Using VS Code Split Terminal

1. Open VS Code terminal
2. Click the **Split Terminal** button (or press `Ctrl+Shift+5`)
3. In first terminal: `cd server && npm run dev`
4. In second terminal: `npm run dev`

---

## 🎨 Features

### Authentication System

- ✅ User Registration with password hashing (bcrypt)
- ✅ Secure Login with JWT tokens
- ✅ HTTP-only cookies for session management
- ✅ Protected dashboard route
- ✅ Logout functionality

### Security Demonstration

- ⚠️ **Vulnerable Endpoint** (`/auth/login-vulnerable`) - Accepts NoSQL injection
- ✅ **Secure Endpoint** (`/auth/login`) - Blocks injection attacks
- 📚 **Documentation** - Complete attack/defense guides
- 🧪 **Automated Tests** - Test scripts included

### UI Features

- 🎨 **Modern Design** - shadcn/ui components
- 🌓 **Dark Mode** - Full theme switching
- 📱 **Responsive** - Works on all devices
- ⚡ **Fast** - Next.js App Router with Server Components

---

## 🎯 Demo Instructions

### Step 1: Create a Test User

1. Go to **http://localhost:3000/signup**
2. Create an account:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **Sign Up**

### Step 2: Demonstrate NoSQL Injection Attack

1. Go to **http://localhost:3000/login**
2. **Enable Demo Mode** (check the checkbox at the top)
3. Enter the attack payload in both fields:
   ```
   Email: {"$ne": null}
   Password: {"$ne": null}
   ```
4. Click **Login**
5. 🎉 **You're logged in!** Without valid credentials!

### Step 3: Show the Secure Version

1. Logout (click user menu → Logout)
2. Go back to login page
3. **Disable Demo Mode** (uncheck the checkbox)
4. Try the same attack:
   ```
   Email: {"$ne": null}
   Password: {"$ne": null}
   ```
5. ❌ **Attack blocked!** Shows "Invalid input" error

### Step 4: Other Attacks to Try

Enable Demo Mode and try these payloads:

**Regex User Enumeration:**

```json
Email: {"$regex": "^test"}
Password: {"$ne": null}
```

**Domain Search:**

```json
Email: {"$regex": "@example.com$"}
Password: {"$ne": null}
```

**Greater Than Operator:**

```json
Email: {"$gt": ""}
Password: {"$ne": null}
```

---

## 🧪 Running Automated Tests

Test the vulnerability automatically:

```powershell
node test-nosql-injection.js
```

This will run 4 tests:

1. ✅ Basic authentication bypass
2. ✅ Regex-based enumeration
3. ✅ Secure endpoint validation
4. ✅ Multiple injection techniques

---

## 📁 Project Structure

```
demoapp/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Protected dashboard page
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Home page (redirects to login)
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── login-form.tsx           # Login form with demo mode
│   ├── signup-form.tsx          # Signup form
│   ├── mode-toggle.tsx          # Dark mode toggle
│   └── theme-provider.tsx       # Theme provider wrapper
│
├── server/                       # Backend Express server
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.js          # Authentication routes
│   │   ├── model.js             # User model (Mongoose)
│   │   ├── db.js                # MongoDB connection
│   │   ├── auth.js              # JWT utilities
│   │   └── index.js             # Express app setup
│   ├── .env                     # Environment variables
│   └── package.json             # Backend dependencies
│
├── NOSQL_INJECTION_DEMO.md      # Detailed security documentation
├── ATTACK_EXAMPLES.md           # Attack payload examples
├── DEMO_INSTRUCTIONS.md         # Presentation guide
├── QUICK_REFERENCE.md           # Quick attack reference
├── test-nosql-injection.js      # Automated test script
└── package.json                 # Frontend dependencies
```

---

## 🛠️ Technologies Used

### Frontend

- **Next.js 16.0.1** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Beautiful UI components
- **next-themes** - Dark mode support
- **lucide-react** - Icon library

### Backend

- **Express 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.19.3** - MongoDB ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcrypt 6.0.0** - Password hashing
- **cookie-parser 1.4.7** - Cookie handling
- **cors** - Cross-origin resource sharing

### Development

- **Nodemon 3.1.10** - Auto-restart server
- **dotenv 17.2.3** - Environment variables

---

## 🧑‍💻 API Endpoints

| Method | Endpoint                 | Description                  | Protected |
| ------ | ------------------------ | ---------------------------- | --------- |
| POST   | `/auth/signup`           | Create new user              | No        |
| POST   | `/auth/login`            | Secure login (SAFE)          | No        |
| POST   | `/auth/login-vulnerable` | Vulnerable login (DEMO ONLY) | No        |
| POST   | `/auth/logout`           | Clear session                | No        |
| GET    | `/auth/me`               | Get current user             | Yes       |

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

```powershell
# Check if MongoDB is running
mongosh

# If not, start MongoDB service
# Windows: Check Services app for "MongoDB Server"
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use

```powershell
# Frontend (3000):
# Change port: PORT=3001 npm run dev

# Backend (4000):
# Edit server/.env and change PORT=4000 to PORT=4001
```

### Module Not Found Errors

```powershell
# Reinstall dependencies
rm -rf node_modules
npm install

# Backend
cd server
rm -rf node_modules
npm install
```

### Dark Mode Not Working

```powershell
# Install required packages
npm install next-themes lucide-react
```

---

## ⚠️ Important Security Notes

### For Educational Use Only

- ✅ Use in controlled environments
- ✅ For cybersecurity training/coursework
- ✅ With explicit permission for testing
- ❌ **NEVER** deploy vulnerable endpoints to production
- ❌ **NEVER** use on systems without authorization

### Before Production Deployment:

1. ❌ **Remove** `/auth/login-vulnerable` endpoint
2. ✅ Change `JWT_SECRET` to a strong random string
3. ✅ Use environment variables for all secrets
4. ✅ Enable HTTPS/TLS
5. ✅ Implement rate limiting
6. ✅ Add request logging and monitoring
7. ✅ Use MongoDB Atlas with authentication
8. ✅ Set up proper CORS policies

---

## 📚 Documentation Files

- **[NOSQL_INJECTION_DEMO.md](./NOSQL_INJECTION_DEMO.md)** - Complete security guide (300+ lines)
- **[ATTACK_EXAMPLES.md](./ATTACK_EXAMPLES.md)** - All attack payloads with examples
- **[DEMO_INSTRUCTIONS.md](./DEMO_INSTRUCTIONS.md)** - Step-by-step presentation guide
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick attack reference card

---

## 👨‍💻 Author

**SHASHI KAUSHAL SINGH**

- GitHub: [@SHASHIKAUSHALSINGH](https://github.com/SHASHIKAUSHALSINGH)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Security concepts from [OWASP](https://owasp.org/)

---

## 🎓 Learning Resources

- [OWASP NoSQL Injection](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Happy Learning! 🚀**

**Remember:** Always practice ethical hacking and never attack systems without permission!
