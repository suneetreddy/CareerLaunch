import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { applications, profile, notification, user, isAuthenticated, isAdmin, logout } = useJobs();
  const close = () => setOpen(false);
  const navigate = useNavigate();
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  const handleLogout = () => {
    close();
    logout();
    navigate("/");
  };

  return (
    <>
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
              <li className="nav-item">
                <NavLink end className={linkClass} to="/" onClick={close}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/jobs" onClick={close}>
                  Find Jobs
                </NavLink>
              </li>

              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <NavLink className={linkClass} to="/dashboard" onClick={close}>
                      Dashboard
                      {applications.length > 0 && (
                        <span className="badge rounded-pill bg-primary ms-1" style={{ fontSize: "0.7rem" }}>
                          {applications.length}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={linkClass} to="/profile" onClick={close} title="Edit Student Profile">
                      <i className="bi bi-person-circle me-1"></i>
                      {user?.name ? user.name.split(" ")[0] : profile?.name ? profile.name.split(" ")[0] : "Profile"}
                      {isAdmin && (
                        <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: "0.65rem" }}>
                          Admin
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className={linkClass} to="/login" onClick={close}>
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                    <Link className="btn btn-indigo rounded-pill px-3 py-1" to="/signup" onClick={close}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Global Toast Notification */}
      {notification && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1090 }}
          role="status"
          aria-live="polite"
        >
          <div className={`toast show align-items-center text-white border-0 shadow-lg ${
            notification.type === "success" ? "bg-success" : notification.type === "danger" ? "bg-danger" : "bg-dark"
          } rounded-3 p-2`}>
            <div className="d-flex align-items-center">
              <div className="toast-body py-1 px-2 d-flex align-items-center">
                <i className={`bi ${notification.type === "success" ? "bi-check-circle-fill" : notification.type === "danger" ? "bi-exclamation-octagon-fill" : "bi-info-circle-fill"} me-2 fs-5`}></i>
                <span>{notification.message}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
