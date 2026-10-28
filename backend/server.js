// CareerLaunch backend - Express API
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jobs = require("./data/jobs.json");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: allow the React app to call this API and read JSON bodies
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CareerLaunch API is running" });
});

// GET /api/jobs - fetch all jobs with optional filters
app.get("/api/jobs", (req, res) => {
  const { q, category, type, location } = req.query;
  let results = [...jobs];

  if (q) {
    const term = q.trim().toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        (j.skills && j.skills.some((s) => s.toLowerCase().includes(term)))
    );
  }

  if (category && category !== "All") {
    results = results.filter((j) => j.category === category);
  }

  if (type && type !== "All") {
    results = results.filter((j) => j.type === type);
  }

  if (location && location !== "All") {
    results = results.filter((j) => j.location === location);
  }

  res.json({
    total: results.length,
    jobs: results
  });
});

// GET /api/jobs/:id - fetch single job by ID
app.get("/api/jobs/:id", (req, res) => {
  const jobId = Number(req.params.id);
  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
});

app.listen(PORT, () => {
  console.log(`CareerLaunch API running on http://localhost:${PORT}`);
});
