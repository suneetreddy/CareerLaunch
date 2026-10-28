import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="cl-footer mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="cl-brand text-white mb-2">
              <i className="bi bi-rocket-takeoff-fill me-2 text-indigo"></i>CareerLaunch
            </div>
            <p className="mb-2 footer-text">
              Internships and entry-level jobs curated specifically for college students and recent graduates.
            </p>
            <div className="small footer-text">
              <i className="bi bi-mortarboard me-1"></i> A college project with local persistence and full application tracking.
            </div>
          </div>
          <div className="col-6 col-md-3 offset-md-1">
            <h6 className="text-white mb-3 fw-bold">Explore</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/jobs">Find Jobs & Internships</Link></li>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-white mb-3 fw-bold">Account</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/profile">My Profile</Link></li>
              <li className="mb-2"><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        <hr className="footer-line my-4" />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="mb-0 footer-text small">
            &copy; 2026 CareerLaunch &bull; Student Internship & Job Portal
          </p>
          <div className="footer-text small">
            Built with React, Vite & Express
          </div>
        </div>
      </div>
    </footer>
  );
}
