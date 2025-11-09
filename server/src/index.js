const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);

const port = Number(process.env.PORT) || 4000;
connectDB().then(() => {
  app.listen(port, () =>
    console.log(`✅ API running at http://localhost:${port}`)
  );
});
