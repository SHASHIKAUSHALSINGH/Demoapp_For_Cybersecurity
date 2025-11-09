const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model");
const {
  signJwt,
  setAuthCookie,
  clearAuthCookie,
  getTokenFromReq,
  verifyJwt,
} = require("../auth");

const router = express.Router();

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request body:", req.body);
    const { fullName, email, password, confirmPassword } = req.body || {};

    if (!fullName || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      passwordHash,
    });

    const token = signJwt({ sub: String(user._id), email: user.email });
    setAuthCookie(res, token);

    res
      .status(201)
      .json({ id: user._id, fullName: user.fullName, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error",error: e.message});
  }
});

// POST /auth/login-vulnerable
// ⚠️ EDUCATIONAL ONLY - DO NOT USE IN PRODUCTION ⚠️
// This endpoint is INTENTIONALLY VULNERABLE to NoSQL Injection
router.post("/login-vulnerable", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    
    // VULNERABILITY: No type checking - allows objects with operators like $ne, $gt
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // VULNERABILITY: Directly passes user input to MongoDB query WITHOUT validation
    // Attacker can send: {"email": {"$ne": null}, "password": {"$ne": null}}
    // MongoDB will find ANY user where email AND password fields exist (are not null)
    const user = await User.findOne({ 
      email: email,  // This accepts objects with $ne, $gt, $regex, etc.
      passwordHash: { $exists: true }  // Just check password field exists
    });
    
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // VULNERABILITY: If user is found via injection, we skip bcrypt check entirely!
    // We only check bcrypt if password is actually a string
    if (typeof password === 'string') {
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    }
    // If password is an object (like {"$ne": null}), we skip the check!

    const token = signJwt({ sub: String(user._id), email: user.email });
    setAuthCookie(res, token);

    res.json({ 
      id: user._id, 
      fullName: user.fullName, 
      email: user.email,
      warning: "⚠️ This endpoint is vulnerable to NoSQL Injection!"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// POST /auth/login
// ✅ SECURE VERSION - Proper input validation
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    
    // FIX 1: Type validation - ensure inputs are strings
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: "Email and password required" });
    }

    // FIX 2: Sanitize email - ensure it's a valid string, not an object
    const sanitizedEmail = String(email).toLowerCase().trim();
    
    // FIX 3: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // FIX 4: Use parameterized query with validated string
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // FIX 5: Always validate password as string
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signJwt({ sub: String(user._id), email: user.email });
    setAuthCookie(res, token);

    res.json({ id: user._id, fullName: user.fullName, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/logout
router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// GET /auth/me
router.get("/me", async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = verifyJwt(token);
    const user = await User.findById(payload.sub).select("_id fullName email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
