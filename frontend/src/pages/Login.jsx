import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="h3 fw-bold mb-1">Welcome back</h1>
        <p className="text-muted mb-4">Log in to continue your job search.</p>

        {submitted && (
          <div className="alert alert-info">
            Login is a preview in Phase 1. Real sign-in will be added in Phase 2.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="email">Email</label>
            <input id="email" type="email" className="form-control" placeholder="you@college.edu" required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" htmlFor="password">Password</label>
            <input id="password" type="password" className="form-control" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn btn-indigo w-100 rounded-pill py-2">Log in</button>
        </form>

        <p className="text-center text-muted mt-4 mb-0">
          New to CareerLaunch? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
