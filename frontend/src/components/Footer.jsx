import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="cl-footer mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="cl-brand text-white mb-2">
              <i className="bi bi-rocket-takeoff-fill me-2"></i>CareerLaunch
            </div>
            <p className="mb-0 footer-text">Internships and entry-level jobs for students, all in one place.</p>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-white mb-3">Explore</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Find Jobs</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-white mb-3">Account</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        <hr className="footer-line my-4" />
        <p className="mb-0 footer-text small">© 2026 CareerLaunch. A college mini-project.</p>
      </div>
    </footer>
  );
}
