import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar navbar-expand-lg cl-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand cl-brand" to="/" onClick={close}>
          <i className="bi bi-rocket-takeoff-fill me-2"></i>CareerLaunch
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={"collapse navbar-collapse" + (open ? " show" : "")}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item"><NavLink end className={linkClass} to="/" onClick={close}>Home</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/jobs" onClick={close}>Find Jobs</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/login" onClick={close}>Login</NavLink></li>
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link className="btn btn-indigo rounded-pill px-4" to="/signup" onClick={close}>Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
