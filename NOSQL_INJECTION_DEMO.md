# NoSQL Injection Demonstration & Solution

## ⚠️ **EDUCATIONAL PURPOSE ONLY**

This demonstration is for cybersecurity education and testing in controlled environments only. **Never use vulnerable code in production.**

---

## 📋 Table of Contents

1. [What is NoSQL Injection?](#what-is-nosql-injection)
2. [Vulnerability Demonstration](#vulnerability-demonstration)
3. [Attack Examples](#attack-examples)
4. [Security Fixes](#security-fixes)
5. [Testing Instructions](#testing-instructions)
6. [Prevention Best Practices](#prevention-best-practices)

---

## 🔍 What is NoSQL Injection?

**NoSQL Injection** is a security vulnerability where attackers manipulate database queries by injecting malicious operators or payloads through user input. Unlike SQL injection, NoSQL injection exploits the flexible schema and query operators of NoSQL databases like MongoDB.

### How It Works:

MongoDB uses query operators like `$ne` (not equal), `$gt` (greater than), `$regex`, etc. When user input isn't validated, attackers can inject these operators to manipulate query logic.

---

## 🚨 Vulnerability Demonstration

### Vulnerable Endpoint: `/auth/login-vulnerable`

**Location:** `server/src/routes/auth.js`

**Vulnerable Code:**

```javascript
router.post("/login-vulnerable", async (req, res) => {
  const { email, password } = req.body || {};

  // ❌ NO TYPE CHECKING - Allows objects with MongoDB operators
  const user = await User.findOne({ email: email });
  // ❌ Attacker can bypass authentication by sending objects
});
```

**Why It's Vulnerable:**

1. No type validation on `email` and `password`
2. Directly passes user input to MongoDB query
3. Accepts objects with operators like `$ne`, `$gt`, `$regex`

---

## 💥 Attack Examples

### Attack #1: Authentication Bypass

**Goal:** Login without knowing any credentials

**Payload:**

```json
{
  "email": { "$ne": null },
  "password": { "$ne": null }
}
```

**Explanation:**

- `{"$ne": null}` means "not equal to null"
- MongoDB returns the first user where email exists AND password exists
- Attacker logs in as the first user in the database!

**Postman/cURL Example:**

```bash
curl -X POST http://localhost:4000/auth/login-vulnerable \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": {"$ne": null}}'
```

---

### Attack #2: Regex-Based User Enumeration

**Goal:** Check if a specific email exists

**Payload:**

```json
{
  "email": { "$regex": "^admin@" },
  "password": { "$ne": null }
}
```

**Explanation:**

- `$regex` performs pattern matching
- Attacker can enumerate valid usernames/emails
- Different error messages reveal if user exists

---

### Attack #3: Greater Than Operator

**Goal:** Bypass authentication using comparison operators

**Payload:**

```json
{
  "email": { "$gt": "" },
  "password": { "$gt": "" }
}
```

**Explanation:**

- `$gt: ""` matches any non-empty string
- Returns first user with non-empty email/password

---

## ✅ Security Fixes

### Secure Endpoint: `/auth/login`

**Fixed Code:**

```javascript
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  // ✅ FIX 1: Type validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid input" });
  }

  // ✅ FIX 2: Sanitize input
  const sanitizedEmail = String(email).toLowerCase().trim();

  // ✅ FIX 3: Validate format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  // ✅ FIX 4: Use validated string in query
  const user = await User.findOne({ email: sanitizedEmail });

  // ✅ FIX 5: Always compare as string
  const ok = await bcrypt.compare(String(password), user.passwordHash);
});
```

**Key Security Improvements:**

1. ✅ **Type Checking**: Ensures inputs are strings, not objects
2. ✅ **Input Sanitization**: Converts to string and normalizes
3. ✅ **Format Validation**: Uses regex to validate email format
4. ✅ **Parameterized Queries**: Uses validated strings, not raw input
5. ✅ **Explicit Type Conversion**: Forces string type for bcrypt

---

## 🧪 Testing Instructions

### Prerequisites

1. Start MongoDB: `mongod` (or ensure it's running)
2. Start backend server:
   ```bash
   cd server
   npm run dev
   ```
3. Create a test user via `/auth/signup`

### Test the Vulnerability

**Using Postman:**

1. **Normal Login (works):**

   ```
   POST http://localhost:4000/auth/login-vulnerable
   Content-Type: application/json

   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **NoSQL Injection Attack (also works!):**

   ```
   POST http://localhost:4000/auth/login-vulnerable
   Content-Type: application/json

   {
     "email": {"$ne": null},
     "password": {"$ne": null}
   }
   ```

   ⚠️ **Result:** You'll be logged in without valid credentials!

3. **Try same attack on secure endpoint (fails):**

   ```
   POST http://localhost:4000/auth/login
   Content-Type: application/json

   {
     "email": {"$ne": null},
     "password": {"$ne": null}
   }
   ```

   ✅ **Result:** Returns "Invalid input" - attack blocked!

### Using cURL:

```bash
# Vulnerable endpoint - ATTACK SUCCEEDS
curl -X POST http://localhost:4000/auth/login-vulnerable \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": {"$ne": null}}'

# Secure endpoint - ATTACK FAILS
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": {"$ne": null}}'
```

---

## 🛡️ Prevention Best Practices

### 1. **Always Validate Input Types**

```javascript
if (typeof email !== "string" || typeof password !== "string") {
  return res.status(400).json({ message: "Invalid input type" });
}
```

### 2. **Use Schema Validation**

```javascript
const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const { error } = loginSchema.validate(req.body);
```

### 3. **Sanitize Inputs**

```javascript
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize()); // Strips out $ and . from user input
```

### 4. **Use ORM/ODM Features**

```javascript
// Mongoose automatically handles some protections
// But still validate types!
const user = await User.findOne({
  email: String(email).toLowerCase(),
});
```

### 5. **Implement Rate Limiting**

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

router.post('/auth/login', loginLimiter, ...);
```

### 6. **Never Trust User Input**

- Always validate
- Always sanitize
- Always use prepared statements/parameterized queries
- Log suspicious patterns

---

## 📊 Comparison Table

| Aspect             | Vulnerable Code   | Secure Code                  |
| ------------------ | ----------------- | ---------------------------- |
| Type Checking      | ❌ None           | ✅ Validates string type     |
| Input Sanitization | ❌ None           | ✅ Converts to string, trims |
| Format Validation  | ❌ None           | ✅ Email regex validation    |
| Query Parameters   | ❌ Raw user input | ✅ Validated strings only    |
| Error Messages     | ❌ May leak info  | ✅ Generic messages          |

---

## 🎓 Learning Resources

- [OWASP NoSQL Injection](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ⚖️ Legal & Ethical Notice

**This demonstration is provided for:**

- Educational purposes
- Security research in controlled environments
- Penetration testing with explicit authorization
- Cybersecurity training and awareness

**Never use these techniques to:**

- Attack systems without permission
- Compromise real user data
- Violate any laws or regulations

**Always:**

- Get written authorization before security testing
- Test only on systems you own or have permission to test
- Follow responsible disclosure practices
- Comply with all applicable laws

---

## 📝 Report Template

Use this for your cybersecurity assignment:

### Executive Summary

This report demonstrates a NoSQL Injection vulnerability in a MongoDB-based authentication system and provides comprehensive mitigation strategies.

### Vulnerability Details

- **Type:** NoSQL Injection (CWE-943)
- **Severity:** Critical (CVSS 9.1)
- **Affected Component:** Login endpoint
- **Attack Vector:** Network-based, no authentication required

### Attack Demonstration

[Include screenshots of Postman requests showing the attack]

### Impact Assessment

- Complete authentication bypass
- Unauthorized access to user accounts
- Potential data breach
- Account takeover

### Remediation Steps

[Reference the Security Fixes section above]

### Verification

[Include screenshots showing the fix prevents the attack]

---

## 🚀 Next Steps

1. ✅ Test the vulnerable endpoint with attack payloads
2. ✅ Verify the secure endpoint blocks attacks
3. ✅ Document your findings with screenshots
4. ✅ Create a presentation showing before/after
5. ✅ **Remove or disable the vulnerable endpoint before any deployment**

---

**Remember:** The vulnerable endpoint (`/auth/login-vulnerable`) should **NEVER** be deployed to production. It exists only for educational demonstration in a local development environment.
