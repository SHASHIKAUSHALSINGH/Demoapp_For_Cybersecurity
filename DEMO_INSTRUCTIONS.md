# 🎯 NoSQL Injection Demo Instructions

## How to Demonstrate the Attack on Login Screen

### Step 1: Start Both Servers

```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

### Step 2: Create a Test User (if you haven't already)

1. Go to http://localhost:3000/signup
2. Create an account with any details:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`

### Step 3: Demonstrate the NoSQL Injection Attack

#### Option A: Through the Login Form UI ✨

1. Go to http://localhost:3000/login

2. **Enable Demo Mode** by checking the "⚠️ Demo Mode (Vulnerable Endpoint)" checkbox

3. **Enter the attack payload** in both fields:

   ```
   Email: {"$ne": null}
   Password: {"$ne": null}
   ```

4. Click **Login**

5. **🎉 SUCCESS!** You should be redirected to `/dashboard` WITHOUT knowing valid credentials!

#### What Just Happened?

When Demo Mode is enabled:

- The form uses the **vulnerable endpoint** (`/auth/login-vulnerable`)
- The input fields accept raw JSON strings
- The payload `{"$ne": null}` becomes a MongoDB operator
- MongoDB query becomes: `{ email: { $ne: null }, passwordHash: { $exists: true } }`
- This matches the FIRST user in the database (bypassing authentication!)

---

## 🛡️ Compare: Secure vs Vulnerable

### Test the Secure Endpoint

1. **Uncheck Demo Mode** (use normal login)
2. Try the same attack:
   ```
   Email: {"$ne": null}
   Password: {"$ne": null}
   ```
3. Click **Login**
4. ❌ **You get an error:** "Invalid input" or "Invalid email format"

This is because the secure endpoint:

- Validates `typeof email === 'string'`
- Validates `typeof password === 'string'`
- Blocks all MongoDB operators

---

## 📊 Side-by-Side Comparison

| Feature               | Vulnerable Endpoint      | Secure Endpoint |
| --------------------- | ------------------------ | --------------- |
| **Route**             | `/auth/login-vulnerable` | `/auth/login`   |
| **Type Validation**   | ❌ None                  | ✅ Yes          |
| **Accepts Objects**   | ⚠️ Yes                   | ❌ No           |
| **MongoDB Operators** | ⚠️ Allowed               | ❌ Blocked      |
| **Attack Success**    | ✅ Bypassed              | ❌ Prevented    |

---

## 🎓 Educational Points to Highlight

1. **User Input is Evil** - Never trust data from users
2. **Type Matters** - Always validate data types on the backend
3. **Frontend Validation ≠ Security** - Can be bypassed easily
4. **Sanitize Inputs** - Remove/escape special characters
5. **Use Parameterized Queries** - Treat all input as data, not code

---

## 🔥 Other Attack Payloads to Try

### 1. Regex Injection (User Enumeration)

```json
Email: {"$regex": "^test"}
Password: {"$ne": null}
```

Finds users whose email starts with "test"

### 2. Greater Than Attack

```json
Email: {"$gt": ""}
Password: {"$ne": null}
```

Matches any email that exists

### 3. Not Equal to Specific User

```json
Email: {"$ne": "admin@example.com"}
Password: {"$ne": null}
```

Login as any user EXCEPT admin

---

## 📹 Presentation Flow

1. **Show normal login** (Demo Mode OFF) with valid credentials
2. **Enable Demo Mode** and explain what changes
3. **Enter attack payload** `{"$ne": null}` in both fields
4. **Show successful bypass** - redirected to dashboard
5. **Disable Demo Mode** and try same attack again
6. **Show it's blocked** - error message appears
7. **Explain the code differences** between endpoints

---

## 🐛 Troubleshooting

### Attack Not Working?

- ✅ Check backend server is running
- ✅ Verify at least one user exists in database
- ✅ Make sure Demo Mode checkbox is enabled
- ✅ Copy payload exactly: `{"$ne": null}`

### "Invalid credentials" Error?

- Backend might not be restarted with latest code
- Try stopping and restarting: `npm run dev` in server/

### Database Issues?

```javascript
// In MongoDB shell or Compass:
use demoapp
db.users.find()  // Should show at least one user
```

---

## 📚 Additional Resources

- See `NOSQL_INJECTION_DEMO.md` for technical details
- See `QUICK_REFERENCE.md` for attack payloads
- Run `node test-nosql-injection.js` for automated tests

---

**⚠️ IMPORTANT:** This is an educational demo. NEVER deploy the vulnerable endpoint to production!
