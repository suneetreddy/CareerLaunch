import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext.jsx";

export default function Login() {
  const { login } = useJobs();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await login(email, password);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg("");
    setLoading(true);

    try {
      await login(demoEmail, demoPassword);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || "Quick login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="h3 fw-bold mb-1">Welcome back</h1>
        <p className="text-muted mb-4">Log in to manage your applications and profile.</p>

        {errorMsg && (
          <div className="alert alert-danger py-2 small mb-3">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="alert alert-success py-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-check-circle-fill fs-5 me-2"></i>
              <strong>Login Successful!</strong>
            </div>
            <p className="small mb-1">Authenticated via MongoDB & JWT.</p>
            <div className="text-muted small fst-italic">
              Redirecting to your Dashboard...
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
            <button type="submit" className="btn btn-indigo w-100 rounded-pill py-2" disabled={loading}>
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</span>
              ) : (
                "Log in"
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Logins for College Viva / Presentation */}
        <div className="p-3 bg-light rounded-3 border mt-4">
          <small className="text-muted fw-bold d-block mb-2 text-center text-uppercase" style={{ fontSize: "0.75rem" }}>
            Quick Demo Logins (MongoDB Seeded):
          </small>
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-indigo rounded-pill"
              onClick={() => handleQuickLogin("student@careerlaunch.edu", "StudentPassword123!")}
              disabled={loading}
            >
              <i className="bi bi-person-fill me-1"></i> Demo Student Account
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill"
              onClick={() => handleQuickLogin("admin@careerlaunch.edu", "AdminPassword123!")}
              disabled={loading}
            >
              <i className="bi bi-shield-lock-fill me-1"></i> Demo Administrator Account
            </button>
          </div>
        </div>

        <p className="text-center text-muted mt-4 mb-0">
          New to CareerLaunch? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
