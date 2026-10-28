import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(""); // "", "mismatch", "done"

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(password === confirm ? "done" : "mismatch");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="h3 fw-bold mb-1">Create your account</h1>
        <p className="text-muted mb-4">Join CareerLaunch and start exploring roles.</p>

        {status === "mismatch" && <div className="alert alert-danger">Passwords do not match. Please type them again.</div>}
        {status === "done" && (
          <div className="alert alert-info">
            Sign up is a preview in Phase 1. Real accounts will be added in Phase 2.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="name">Full name</label>
            <input id="name" type="text" className="form-control" placeholder="Your full name" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="remail">Email</label>
            <input id="remail" type="email" className="form-control" placeholder="you@college.edu" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="rpass">Password</label>
            <input id="rpass" type="password" className="form-control" placeholder="At least 6 characters"
              minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" htmlFor="rconfirm">Confirm password</label>
            <input id="rconfirm" type="password" className="form-control" placeholder="Type the password again"
              required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-indigo w-100 rounded-pill py-2">Sign up</button>
        </form>

        <p className="text-center text-muted mt-4 mb-0">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
