require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Job = require("./models/Job");
const SavedJob = require("./models/SavedJob");
const Application = require("./models/Application");
const Profile = require("./models/Profile");
const jobsData = require("./data/jobs.json");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careerlaunch";

async function seedDatabase() {
  console.log("--> Checking & Seeding MongoDB Data...");

  // 1. Seed or Verify Demo Admin Account
  const adminEmail = "admin@careerlaunch.edu";
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash("AdminPassword123!", 10);
    adminUser = await User.create({
      name: "Portal Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("   [+] Admin account seeded:", adminEmail);
  } else {
    // Ensure admin role is enforced
    if (adminUser.role !== "admin") {
      adminUser.role = "admin";
      await adminUser.save();
    }
  }

  // 2. Seed or Verify Demo Student Account
  const studentEmail = "student@careerlaunch.edu";
  let studentUser = await User.findOne({ email: studentEmail });
  if (!studentUser) {
    const hashedPassword = await bcrypt.hash("StudentPassword123!", 10);
    studentUser = await User.create({
      name: "Arjun Sharma",
      email: studentEmail,
      password: hashedPassword,
      role: "student",
    });
    console.log("   [+] Student demo account seeded:", studentEmail);
  }

  // 3. Seed Profile for Student
  let studentProfile = await Profile.findOne({ user: studentUser._id });
  if (!studentProfile) {
    studentProfile = await Profile.create({
      user: studentUser._id,
      name: "Arjun Sharma",
      email: studentEmail,
      phone: "+91 98765 43210",
      college: "National Institute of Technology",
      degree: "B.Tech Computer Science & Engineering",
      gradYear: "2026",
      location: "Bengaluru, India",
      bio: "Passionate pre-final year engineering student interested in full-stack development, modern web applications, and UI/UX design.",
      skills: ["React", "JavaScript", "Node.js", "Python", "SQL", "Git", "Figma"],
      github: "https://github.com/student-demo",
      linkedin: "https://linkedin.com/in/student-demo",
      portfolio: "https://student-portfolio.demo",
    });
    console.log("   [+] Student profile seeded for:", studentUser.name);
  }

  // 4. Seed Jobs from jobs.json (Idempotent - no duplicates)
  let seededJobsCount = 0;
  for (const item of jobsData) {
    const exists = await Job.findOne({ title: item.title, company: item.company });
    if (!exists) {
      await Job.create({
        ...item,
        legacyId: item.id,
        createdBy: adminUser._id,
      });
      seededJobsCount++;
    } else if (!exists.legacyId) {
      exists.legacyId = item.id;
      await exists.save();
    }
  }
  if (seededJobsCount > 0) {
    console.log(`   [+] Seeded ${seededJobsCount} jobs into MongoDB collection 'jobs'.`);
  }

  // 5. Seed initial demo applications for student if none exist
  const existingApps = await Application.find({ user: studentUser._id });
  if (existingApps.length === 0) {
    const job1 = await Job.findOne({ legacyId: 1 });
    const job3 = await Job.findOne({ legacyId: 3 });

    if (job1) {
      await Application.create({
        applicationId: "APP-104921",
        user: studentUser._id,
        job: job1._id,
        applicantName: studentUser.name,
        email: studentUser.email,
        phone: "+91 98765 43210",
        college: "National Institute of Technology",
        degree: "B.Tech CSE",
        gradYear: "2026",
        resumeLink: "https://example.com/resume-arjun.pdf",
        coverNote: "I have built multiple React projects and would love to contribute to educational software at Pixelwave Labs.",
        status: "Pending",
      });
    }

    if (job3) {
      await Application.create({
        applicationId: "APP-098234",
        user: studentUser._id,
        job: job3._id,
        applicantName: studentUser.name,
        email: studentUser.email,
        phone: "+91 98765 43210",
        college: "National Institute of Technology",
        degree: "B.Tech CSE",
        gradYear: "2026",
        resumeLink: "https://example.com/portfolio-arjun",
        coverNote: "Excited by Studio Marigold's client work. I have 2 design case studies in Figma and conduct usability testing.",
        status: "Accepted",
      });
    }
    console.log("   [+] Demo applications seeded for student.");
  }

  // 6. Seed initial saved job for student if none exist
  const existingSaved = await SavedJob.find({ user: studentUser._id });
  if (existingSaved.length === 0) {
    const job2 = await Job.findOne({ legacyId: 2 });
    if (job2) {
      await SavedJob.create({
        user: studentUser._id,
        job: job2._id,
      });
      console.log("   [+] Demo saved job seeded for student.");
    }
  }

  console.log("--> Seeding completed successfully.");
}

// Allow direct CLI execution: node seed.js
if (require.main === module) {
  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      await seedDatabase();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
