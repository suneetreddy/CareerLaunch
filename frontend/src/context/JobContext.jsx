import { createContext, useContext, useState, useEffect } from "react";
import { jobs as initialJobs } from "../data/jobs.js";

const JobContext = createContext();

const DEFAULT_PROFILE = {
  name: "Arjun Sharma",
  email: "arjun.sharma@college.edu",
  phone: "+91 98765 43210",
  college: "National Institute of Technology",
  degree: "B.Tech Computer Science & Engineering",
  gradYear: "2026",
  location: "Bengaluru, India",
  bio: "Passionate pre-final year engineering student interested in full-stack development, modern web applications, and UI/UX design.",
  skills: ["React", "JavaScript", "Node.js", "Python", "SQL", "Git", "Figma"],
  github: "https://github.com/student-demo",
  linkedin: "https://linkedin.com/in/student-demo",
  portfolio: "https://student-portfolio.demo"
};

const DEFAULT_APPLICATIONS = [
  {
    id: "APP-104921",
    jobId: 1,
    jobTitle: "Frontend Developer Intern",
    company: "Pixelwave Labs",
    category: "Software Development",
    location: "Bengaluru",
    type: "Internship",
    applicantName: "Arjun Sharma",
    email: "arjun.sharma@college.edu",
    phone: "+91 98765 43210",
    college: "National Institute of Technology",
    degree: "B.Tech CSE",
    gradYear: "2026",
    resumeLink: "https://example.com/resume-arjun.pdf",
    coverNote: "I have built multiple React projects and would love to contribute to educational software at Pixelwave Labs.",
    appliedAt: "25 Oct 2026",
    status: "Pending" // Pending, Accepted, Rejected
  },
  {
    id: "APP-098234",
    jobId: 3,
    jobTitle: "UI/UX Design Intern",
    company: "Studio Marigold",
    category: "Design & UI/UX",
    location: "Remote",
    type: "Internship",
    applicantName: "Arjun Sharma",
    email: "arjun.sharma@college.edu",
    phone: "+91 98765 43210",
    college: "National Institute of Technology",
    degree: "B.Tech CSE",
    gradYear: "2026",
    resumeLink: "https://example.com/portfolio-arjun",
    coverNote: "Excited by Studio Marigold's client work. I have 2 design case studies in Figma and conduct usability testing.",
    appliedAt: "22 Oct 2026",
    status: "Accepted"
  }
];

const DEFAULT_SAVED_JOBS = [2, 11]; // Northbridge Analytics & AppVenture Studios

export function JobProvider({ children }) {
  // 1. Saved Jobs
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const stored = localStorage.getItem("cl_saved_jobs");
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_JOBS;
    } catch (err) {
      console.error("Error reading saved jobs from localStorage", err);
      return DEFAULT_SAVED_JOBS;
    }
  });

  // 2. Applications
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem("cl_applications");
      return stored ? JSON.parse(stored) : DEFAULT_APPLICATIONS;
    } catch (err) {
      console.error("Error reading applications from localStorage", err);
      return DEFAULT_APPLICATIONS;
    }
  });

  // 3. User Profile
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("cl_profile");
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch (err) {
      console.error("Error reading profile from localStorage", err);
      return DEFAULT_PROFILE;
    }
  });

  // 4. Notification feedback (temporary toast/message)
  const [notification, setNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cl_saved_jobs", JSON.stringify(savedJobs));
    } catch (err) {
      console.error("Failed to persist saved jobs", err);
    }
  }, [savedJobs]);

  useEffect(() => {
    try {
      localStorage.setItem("cl_applications", JSON.stringify(applications));
    } catch (err) {
      console.error("Failed to persist applications", err);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem("cl_profile", JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to persist profile", err);
    }
  }, [profile]);

  // Helper notification dispatcher
  const notify = (message, type = "success") => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 3500);
  };

  // Saved Jobs Methods
  const isJobSaved = (jobId) => savedJobs.includes(Number(jobId));

  const saveJob = (jobId) => {
    const id = Number(jobId);
    if (!savedJobs.includes(id)) {
      setSavedJobs((prev) => [...prev, id]);
      notify("Job saved to your bookmarks!", "success");
    }
  };

  const unsaveJob = (jobId) => {
    const id = Number(jobId);
    setSavedJobs((prev) => prev.filter((item) => item !== id));
    notify("Job removed from saved list.", "info");
  };

  const toggleSaveJob = (jobId) => {
    const id = Number(jobId);
    if (isJobSaved(id)) {
      unsaveJob(id);
    } else {
      saveJob(id);
    }
  };

  // Applications Methods
  const hasApplied = (jobId) => applications.some((app) => Number(app.jobId) === Number(jobId));

  const getApplication = (jobId) => applications.find((app) => Number(app.jobId) === Number(jobId)) || null;

  const applyToJob = (applicationData) => {
    const jobId = Number(applicationData.jobId);
    if (hasApplied(jobId)) {
      return { success: false, message: "You have already applied for this job." };
    }

    const newApp = {
      id: "APP-" + Math.floor(100000 + Math.random() * 900000),
      jobId,
      jobTitle: applicationData.jobTitle,
      company: applicationData.company,
      category: applicationData.category || "General",
      location: applicationData.location,
      type: applicationData.type,
      applicantName: applicationData.applicantName || profile.name,
      email: applicationData.email || profile.email,
      phone: applicationData.phone || profile.phone,
      college: applicationData.college || profile.college,
      degree: applicationData.degree || profile.degree,
      gradYear: applicationData.gradYear || profile.gradYear,
      resumeLink: applicationData.resumeLink,
      coverNote: applicationData.coverNote || "",
      appliedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      status: "Pending" // Default status is always Pending
    };

    setApplications((prev) => [newApp, ...prev]);
    notify(`Application for ${newApp.jobTitle} submitted successfully!`, "success");
    return { success: true, application: newApp };
  };

  const withdrawApplication = (appId) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    notify("Application withdrawn.", "info");
  };

  // Allows college demo presenter to cycle or set demo statuses (Pending -> Accepted -> Rejected)
  const updateApplicationStatus = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    notify(`Application status updated to "${newStatus}"`, "info");
  };

  // Profile Methods
  const updateProfile = (updatedData) => {
    setProfile((prev) => ({ ...prev, ...updatedData }));
    notify("Profile updated successfully!", "success");
  };

  // Reset to default demo data helper
  const resetDemoData = () => {
    setSavedJobs(DEFAULT_SAVED_JOBS);
    setApplications(DEFAULT_APPLICATIONS);
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem("cl_saved_jobs");
    localStorage.removeItem("cl_applications");
    localStorage.removeItem("cl_profile");
    notify("Demo data restored to defaults.", "info");
  };

  return (
    <JobContext.Provider
      value={{
        jobs: initialJobs,
        savedJobs,
        applications,
        profile,
        notification,
        isJobSaved,
        saveJob,
        unsaveJob,
        toggleSaveJob,
        hasApplied,
        getApplication,
        applyToJob,
        withdrawApplication,
        updateApplicationStatus,
        updateProfile,
        resetDemoData,
        notify
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
}
