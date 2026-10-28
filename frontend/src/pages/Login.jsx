import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext.jsx";

export default function Login() {
  const { profile, updateProfile, notify } = useJobs();
  const [email, setEmail] = useState(profile.email || "");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      updateProfile({ email });
    }
    setSubmitted(true);
    notify("Logged in demo session successfully!", "success");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="h3 fw-bold mb-1">Welcome back</h1>
        <p className="text-muted mb-4">Log in to continue your job search.</p>

        {submitted ? (
          <div className="alert alert-success py-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-check-circle-fill fs-5 me-2"></i>
              <strong>Login Successful!</strong>
            </div>
            <p className="small mb-2">
              Redirecting you to your <strong>Student Dashboard</strong>...
            </p>
            <div className="text-muted small fst-italic">
              Note: This is a front-end demo session backed by browser localStorage (no remote DB required).
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="you@college.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-indigo w-100 rounded-pill py-2">Log in</button>
          </form>
        )}

        <div className="p-3 bg-light rounded-3 border mt-4 text-center">
          <small className="text-muted d-block mb-1">College Project Demo Quick Login:</small>
          <button
            type="button"
            className="btn btn-sm btn-outline-indigo rounded-pill px-3"
            onClick={() => {
              notify("Signed in as demo student", "info");
              navigate("/dashboard");
            }}
          >
            <i className="bi bi-box-arrow-in-right me-1"></i> Quick Demo Access
          </button>
        </div>

        <p className="text-center text-muted mt-4 mb-0">
          New to CareerLaunch? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
