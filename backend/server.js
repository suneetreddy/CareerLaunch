// CareerLaunch backend - Phase 1 foundation
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: allow the React app to call this API and read JSON bodies
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CareerLaunch API is running" });
});

app.listen(PORT, () => {
  console.log(`CareerLaunch API running on http://localhost:${PORT}`);
});
