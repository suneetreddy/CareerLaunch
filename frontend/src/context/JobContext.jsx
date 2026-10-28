import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jobs as initialJobs } from "../data/jobs.js";

const JobContext = createContext();

const API_BASE = "http://localhost:5000/api";

const DEFAULT_PROFILE = {
  name: "Arjun Sharma",
  email: "student@careerlaunch.edu",
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
};

export function JobProvider({ children }) {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem("cl_jwt_token") || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("cl_user_data");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Data States
  const [jobs, setJobs] = useState(initialJobs);
  const [savedJobs, setSavedJobs] = useState([]); // Array of job IDs or jobs
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Helper notification dispatcher
  const notify = useCallback((message, type = "success") => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 3500);
  }, []);

  // Headers helper with Authorization
  const getAuthHeaders = useCallback(() => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  // Fetch Jobs from MongoDB
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          // Normalize jobs to ensure both _id and legacy id are accessible
          const normalized = data.jobs.map((j) => ({
            ...j,
            id: j.legacyId || j._id,
          }));
          setJobs(normalized);
        }
      }
    } catch {
      // Keep static jobs fallback if backend is offline
    }
  }, []);

  // Fetch User's Saved Jobs from MongoDB
  const fetchSavedJobs = useCallback(async () => {
    if (!token) {
      setSavedJobs([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/saved-jobs`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        // data.savedJobs contains populated Job objects
        const ids = (data.savedJobs || []).map((j) => j.legacyId || j._id);
        setSavedJobs(ids);
      }
    } catch (err) {
      console.error("Failed to load saved jobs from MongoDB:", err);
    }
  }, [token, getAuthHeaders]);

  // Fetch User's Applications from MongoDB
  const fetchApplications = useCallback(async () => {
    if (!token) {
      setApplications([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/applications`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.applications || []).map((app) => ({
          id: app.applicationId || app._id,
          _id: app._id,
          jobId: app.job?.legacyId || app.job?._id,
          jobTitle: app.job?.title || "Job Application",
          company: app.job?.company || "Company",
          category: app.job?.category || "General",
          location: app.job?.location || "",
          type: app.job?.type || "",
          applicantName: app.applicantName,
          email: app.email,
          phone: app.phone,
          college: app.college,
          degree: app.degree,
          gradYear: app.gradYear,
          resumeLink: app.resumeLink,
          coverNote: app.coverNote,
          appliedAt: new Date(app.createdAt || Date.now()).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          status: app.status || "Pending",
        }));
        setApplications(formatted);
      }
    } catch (err) {
      console.error("Failed to load applications from MongoDB:", err);
    }
  }, [token, getAuthHeaders]);

  // Fetch User's Profile from MongoDB
  const fetchProfile = useCallback(async () => {
    if (!token) {
      setProfile(DEFAULT_PROFILE);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/profile`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({
          ...prev,
          ...data,
          skills: data.skills && data.skills.length > 0 ? data.skills : prev.skills,
        }));
      }
    } catch (err) {
      console.error("Failed to load profile from MongoDB:", err);
    }
  }, [token, getAuthHeaders]);

  // Load Initial Data on Mount & Token Change
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await fetchJobs();
      if (token) {
        await Promise.all([fetchSavedJobs(), fetchApplications(), fetchProfile()]);
      }
      setLoading(false);
    }
    loadData();
  }, [token, fetchJobs, fetchSavedJobs, fetchApplications, fetchProfile]);

  // Sync Auth State to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("cl_jwt_token", token);
    } else {
      localStorage.removeItem("cl_jwt_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cl_user_data", JSON.stringify(user));
    } else {
      localStorage.removeItem("cl_user_data");
    }
  }, [user]);

  // Auth Actions
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setToken(data.token);
    setUser(data.user);
    notify(`Welcome back, ${data.user.name}!`, "success");
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    setToken(data.token);
    setUser(data.user);
    notify(`Account created successfully! Welcome, ${data.user.name}.`, "success");
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSavedJobs([]);
    setApplications([]);
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem("cl_jwt_token");
    localStorage.removeItem("cl_user_data");
    notify("Logged out successfully.", "info");
  };

  // Saved Jobs Methods
  const isJobSaved = (jobId) => {
    return savedJobs.some((id) => String(id) === String(jobId));
  };

  const saveJob = async (jobId) => {
    if (!token) {
      notify("Please log in to save jobs to your account.", "info");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/saved-jobs/${jobId}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setSavedJobs((prev) => [...prev, jobId]);
        notify("Job bookmarked to MongoDB!", "success");
      } else {
        const errData = await res.json();
        notify(errData.error || "Failed to save job.", "danger");
      }
    } catch {
      notify("Network error while saving job.", "danger");
    }
  };

  const unsaveJob = async (jobId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/saved-jobs/${jobId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setSavedJobs((prev) => prev.filter((id) => String(id) !== String(jobId)));
        notify("Job removed from saved bookmarks.", "info");
      }
    } catch {
      notify("Network error while removing saved job.", "danger");
    }
  };

  const toggleSaveJob = (jobId) => {
    if (isJobSaved(jobId)) {
      unsaveJob(jobId);
    } else {
      saveJob(jobId);
    }
  };

  // Application Methods
  const hasApplied = (jobId) => {
    return applications.some((app) => String(app.jobId) === String(jobId));
  };

  const getApplication = (jobId) => {
    return applications.find((app) => String(app.jobId) === String(jobId)) || null;
  };

  const applyToJob = async (applicationData) => {
    if (!token) {
      notify("Please log in before submitting an application.", "info");
      return { success: false, message: "Authentication required." };
    }

    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(applicationData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Failed to submit application." };
      }

      await fetchApplications();
      notify(`Application for ${applicationData.jobTitle || "the position"} saved to MongoDB!`, "success");
      return { success: true, application: data.application };
    } catch (err) {
      return { success: false, message: err.message || "Network error occurred." };
    }
  };

  const withdrawApplication = async (appId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/applications/${appId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== appId && a._id !== appId));
        notify("Application withdrawn from MongoDB.", "info");
      } else {
        const errData = await res.json();
        notify(errData.error || "Failed to withdraw application.", "danger");
      }
    } catch {
      notify("Network error while withdrawing application.", "danger");
    }
  };

  // Admin status update: updates status in MongoDB
  const updateApplicationStatus = async (appId, newStatus) => {
    if (!token || user?.role !== "admin") {
      notify("Only administrators can update application statuses in MongoDB.", "danger");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/applications/${appId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId || app._id === appId ? { ...app, status: newStatus } : app))
        );
        notify(`Application status updated to "${newStatus}" in MongoDB!`, "success");
      } else {
        const errData = await res.json();
        notify(errData.error || "Failed to update status.", "danger");
      }
    } catch {
      notify("Network error updating application status.", "danger");
    }
  };

  // Profile Update
  const updateProfile = async (updatedData) => {
    if (!token) {
      setProfile((prev) => ({ ...prev, ...updatedData }));
      notify("Profile updated locally.", "info");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({ ...prev, ...data.profile }));
        if (data.profile.name && user) {
          setUser((prev) => ({ ...prev, name: data.profile.name }));
        }
        notify("Profile updated and persisted to MongoDB!", "success");
      } else {
        const errData = await res.json();
        notify(errData.error || "Failed to update profile in database.", "danger");
      }
    } catch {
      notify("Network error while updating profile.", "danger");
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        savedJobs,
        applications,
        profile,
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isAdmin: Boolean(user && user.role === "admin"),
        loading,
        notification,
        login,
        register,
        logout,
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
        notify,
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
