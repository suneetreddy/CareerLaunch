import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext.jsx";

export default function Register() {
  const { register } = useJobs();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(""); // "", "mismatch", "done", "error"
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setStatus("mismatch");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      setStatus("done");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="h3 fw-bold mb-1">Create your account</h1>
        <p className="text-muted mb-4">Join CareerLaunch and start exploring roles.</p>

        {status === "mismatch" && (
          <div className="alert alert-danger py-2 small">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> Passwords do not match. Please re-enter them.
          </div>
        )}

        {status === "error" && (
          <div className="alert alert-danger py-2 small">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorMsg}
          </div>
        )}

        {status === "done" ? (
          <div className="alert alert-success py-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-check-circle-fill fs-5 me-2"></i>
              <strong>Account Registered!</strong>
            </div>
            <p className="small mb-1">
              Account created in MongoDB for <strong>{name}</strong> ({email}).
            </p>
            <div className="text-muted small fst-italic">
              Redirecting to your Dashboard...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="remail">Email</label>
              <input
                id="remail"
                type="email"
                className="form-control"
                placeholder="you@college.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="rpass">Password</label>
              <input
                id="rpass"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="rconfirm">Confirm password</label>
              <input
                id="rconfirm"
                type="password"
                className="form-control"
                placeholder="Type the password again"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-indigo w-100 rounded-pill py-2" disabled={loading}>
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</span>
              ) : (
                "Sign up"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-muted mt-4 mb-0">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
