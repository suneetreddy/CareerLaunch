// CareerLaunch backend - Complete MERN API with MongoDB, Mongoose & JWT
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Job = require("./models/Job");
const SavedJob = require("./models/SavedJob");
const Application = require("./models/Application");
const Profile = require("./models/Profile");
const { verifyToken, requireAdmin } = require("./middleware/auth");
const seedDatabase = require("./seed");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careerlaunch";
const JWT_SECRET = process.env.JWT_SECRET || "careerlaunch_super_secret_jwt_key_2026";

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Helper: resolve Job by MongoDB ObjectId or legacyId (numeric)
async function findJobByIdOrLegacy(identifier) {
  if (mongoose.isValidObjectId(identifier)) {
    const job = await Job.findById(identifier);
    if (job) return job;
  }
  const numericId = Number(identifier);
  if (!isNaN(numericId)) {
    return await Job.findOne({ legacyId: numericId });
  }
  return null;
}

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log(`Connected to MongoDB successfully at ${MONGODB_URI}`);
    // Check and seed default jobs & accounts if needed
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.error("Auto-seed error:", seedErr.message);
    }
  })
  .catch((err) => {
    console.error(`MongoDB connection error (${MONGODB_URI}):`, err.message);
  });

// ================= HEALTH CHECK =================

app.get("/api/health", async (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbStatus = dbStates[mongoose.connection.readyState] || "unknown";

  let counts = { users: 0, jobs: 0, applications: 0, savedJobs: 0 };
  if (mongoose.connection.readyState === 1) {
    try {
      counts.users = await User.countDocuments();
      counts.jobs = await Job.countDocuments();
      counts.applications = await Application.countDocuments();
      counts.savedJobs = await SavedJob.countDocuments();
    } catch {
      // Ignore count errors in health check
    }
  }

  res.json({
    status: "ok",
    message: "CareerLaunch MERN API is running",
    database: {
      status: dbStatus,
      connected: mongoose.connection.readyState === 1,
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
      counts,
    },
  });
});

// ================= AUTHENTICATION ROUTES =================

// POST /api/auth/register - Register a new user (Enforces student role)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // SECURITY: Always enforce student role on public registration
    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "student",
    });

    // Auto-create initial profile for the new user
    await Profile.create({
      user: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed. " + err.message });
  }
});

// POST /api/auth/login - Authenticate user against MongoDB and return JWT
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. " + err.message });
  }
});

// GET /api/auth/me - Get currently authenticated user
app.get("/api/auth/me", verifyToken, async (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/users - List registered users (ADMIN ONLY - protected from public enumeration)
app.get("/api/auth/users", verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json({ total: users.length, users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users. " + err.message });
  }
});

// ================= STUDENT PROFILE ROUTES =================

// GET /api/profile - Fetch current user's profile
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile. " + err.message });
  }
});

// PUT /api/profile - Update current user's profile
app.put("/api/profile", verifyToken, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "college",
      "degree",
      "gradYear",
      "location",
      "bio",
      "skills",
      "github",
      "linkedin",
      "portfolio",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // Keep name in sync with User collection if updated
    if (updates.name && updates.name.trim() !== req.user.name) {
      await User.findByIdAndUpdate(req.user._id, { name: updates.name.trim() });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile. " + err.message });
  }
});

// ================= JOB ROUTES =================

// GET /api/jobs - Fetch jobs from MongoDB with search and filtering
app.get("/api/jobs", async (req, res) => {
  try {
    const { q, category, type, location } = req.query;
    const filter = {};

    if (q) {
      const term = q.trim();
      filter.$or = [
        { title: { $regex: term, $options: "i" } },
        { company: { $regex: term, $options: "i" } },
        { skills: { $regex: term, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (type && type !== "All") {
      filter.type = type;
    }

    if (location && location !== "All") {
      filter.location = location;
    }

    const results = await Job.find(filter).sort({ createdAt: -1 });

    res.json({
      total: results.length,
      jobs: results,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs. " + err.message });
  }
});

// GET /api/jobs/:id - Fetch single job by MongoDB ID or legacyId
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await findJobByIdOrLegacy(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve job. " + err.message });
  }
});

// POST /api/jobs - Create a new job (ADMIN ONLY)
app.post("/api/jobs", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, company, category, location, type, pay, summary, about, responsibilities, requirements, skills } = req.body;

    if (!title || !company || !category || !location || !type || !pay || !summary || !about) {
      return res.status(400).json({ error: "All required job fields must be provided." });
    }

    const newJob = await Job.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ error: "Failed to create job. " + err.message });
  }
});

// PUT /api/jobs/:id - Update an existing job (ADMIN ONLY)
app.put("/api/jobs/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const job = await findJobByIdOrLegacy(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const updatedJob = await Job.findByIdAndUpdate(job._id, { $set: req.body }, { new: true });
    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    res.status(500).json({ error: "Failed to update job. " + err.message });
  }
});

// DELETE /api/jobs/:id - Delete a job (ADMIN ONLY)
app.delete("/api/jobs/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const job = await findJobByIdOrLegacy(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    await Job.findByIdAndDelete(job._id);
    // Also cleanup associated saved jobs and applications
    await SavedJob.deleteMany({ job: job._id });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job. " + err.message });
  }
});

// ================= SAVED JOBS ROUTES (MongoDB) =================

// GET /api/saved-jobs - Fetch saved jobs for the authenticated user
app.get("/api/saved-jobs", verifyToken, async (req, res) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });

    // Filter out any dangling saved jobs whose job document was removed
    const validJobs = saved.filter((s) => s.job !== null).map((s) => s.job);

    res.json({
      total: validJobs.length,
      savedJobs: validJobs,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved jobs. " + err.message });
  }
});

// POST /api/saved-jobs/:jobId - Save a job for current user
app.post("/api/saved-jobs/:jobId", verifyToken, async (req, res) => {
  try {
    const job = await findJobByIdOrLegacy(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const existing = await SavedJob.findOne({ user: req.user._id, job: job._id });
    if (existing) {
      return res.status(200).json({ message: "Job is already saved", jobId: job._id });
    }

    await SavedJob.create({
      user: req.user._id,
      job: job._id,
    });

    res.status(201).json({ message: "Job bookmarked successfully", jobId: job._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save job. " + err.message });
  }
});

// DELETE /api/saved-jobs/:jobId - Unsave a job for current user
app.delete("/api/saved-jobs/:jobId", verifyToken, async (req, res) => {
  try {
    const job = await findJobByIdOrLegacy(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    await SavedJob.deleteOne({ user: req.user._id, job: job._id });
    res.json({ message: "Job removed from saved list", jobId: job._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to unsave job. " + err.message });
  }
});

// ================= APPLICATION ROUTES (MongoDB) =================

// GET /api/applications - Get applications (User gets their own; Admin gets all)
app.get("/api/applications", verifyToken, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user._id };
    const apps = await Application.find(query).populate("job").sort({ createdAt: -1 });

    res.json({
      total: apps.length,
      applications: apps,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications. " + err.message });
  }
});

// GET /api/applications/:id - Get single application
app.get("/api/applications/:id", verifyToken, async (req, res) => {
  try {
    let appDoc;
    if (mongoose.isValidObjectId(req.params.id)) {
      appDoc = await Application.findById(req.params.id).populate("job");
    } else {
      appDoc = await Application.findOne({ applicationId: req.params.id }).populate("job");
    }

    if (!appDoc) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Authorization: User can only view their own application, unless admin
    if (req.user.role !== "admin" && !appDoc.user.equals(req.user._id)) {
      return res.status(403).json({ error: "Access denied. Cannot view another user's application." });
    }

    res.json(appDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch application. " + err.message });
  }
});

// POST /api/applications - Apply for a job (Prevents duplicate applications)
app.post("/api/applications", verifyToken, async (req, res) => {
  try {
    const { jobId, applicantName, email, phone, college, degree, gradYear, resumeLink, coverNote } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required." });
    }

    const job = await findJobByIdOrLegacy(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // CHECK DUPLICATE APPLICATION
    const existing = await Application.findOne({ user: req.user._id, job: job._id });
    if (existing) {
      return res.status(400).json({
        error: "You have already applied for this job.",
        existingApplicationId: existing.applicationId,
      });
    }

    if (!applicantName || !email || !phone || !college || !degree || !resumeLink) {
      return res.status(400).json({ error: "Please provide all required application details." });
    }

    const newApp = await Application.create({
      applicationId: "APP-" + Math.floor(100000 + Math.random() * 900000),
      user: req.user._id,
      job: job._id,
      applicantName: applicantName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      college: college.trim(),
      degree: degree.trim(),
      gradYear: gradYear || "2026",
      resumeLink: resumeLink.trim(),
      coverNote: coverNote ? coverNote.trim() : "",
      status: "Pending",
    });

    const populatedApp = await Application.findById(newApp._id).populate("job");

    res.status(201).json({
      message: `Application submitted successfully for ${job.title}!`,
      application: populatedApp,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }
    res.status(500).json({ error: "Failed to submit application. " + err.message });
  }
});

// DELETE /api/applications/:id - Withdraw application
app.delete("/api/applications/:id", verifyToken, async (req, res) => {
  try {
    let appDoc;
    if (mongoose.isValidObjectId(req.params.id)) {
      appDoc = await Application.findById(req.params.id);
    } else {
      appDoc = await Application.findOne({ applicationId: req.params.id });
    }

    if (!appDoc) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Authorization: only the applicant or an admin can withdraw
    if (req.user.role !== "admin" && !appDoc.user.equals(req.user._id)) {
      return res.status(403).json({ error: "Access denied. Cannot withdraw another user's application." });
    }

    await Application.findByIdAndDelete(appDoc._id);
    res.json({ message: "Application withdrawn successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to withdraw application. " + err.message });
  }
});

// PATCH /api/applications/:id/status - Update application status (ADMIN ONLY)
app.patch("/api/applications/:id/status", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Accepted", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be Pending, Accepted, or Rejected." });
    }

    let appDoc;
    if (mongoose.isValidObjectId(req.params.id)) {
      appDoc = await Application.findById(req.params.id);
    } else {
      appDoc = await Application.findOne({ applicationId: req.params.id });
    }

    if (!appDoc) {
      return res.status(404).json({ error: "Application not found" });
    }

    appDoc.status = status;
    await appDoc.save();

    const populatedApp = await Application.findById(appDoc._id).populate("job");

    res.json({
      message: `Application status updated to ${status}`,
      application: populatedApp,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update application status. " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`CareerLaunch API running on http://localhost:${PORT}`);
});
