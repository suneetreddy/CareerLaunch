import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="card job-card h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-center mb-3">
          <div className="logo-badge me-3" style={{ background: job.color }}>
            {job.company.charAt(0)}
          </div>
          <div>
            <h5 className="mb-0 fs-6 fw-bold">{job.title}</h5>
            <small className="text-muted">{job.company}</small>
          </div>
        </div>
        <p className="text-muted small flex-grow-1">{job.summary}</p>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="pill pill-indigo">{job.type}</span>
          <span className="pill"><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold small">{job.pay}</span>
          <Link to={`/jobs/${job.id}`} className="btn btn-outline-indigo btn-sm rounded-pill px-3">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
