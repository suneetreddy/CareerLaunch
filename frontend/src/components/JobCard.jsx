import { Link } from "react-router-dom";
import { useJobs } from "../context/JobContext.jsx";

export default function JobCard({ job }) {
  const { isJobSaved, toggleSaveJob, hasApplied } = useJobs();
  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id);

  return (
    <div className="card job-card h-100 position-relative">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="logo-badge me-3" style={{ background: job.color }}>
              {job.company.charAt(0)}
            </div>
            <div>
              <h5 className="mb-0 fs-6 fw-bold text-truncate" style={{ maxWidth: "180px" }} title={job.title}>
                {job.title}
              </h5>
              <small className="text-muted">{job.company}</small>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-1 text-secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            title={saved ? "Remove from saved" : "Save this job"}
            aria-label={saved ? "Remove from saved" : "Save this job"}
          >
            <i
              className={`bi ${saved ? "bi-bookmark-check-fill text-primary" : "bi-bookmark"} fs-5`}
              style={saved ? { color: "var(--indigo)" } : {}}
            ></i>
          </button>
        </div>

        <p className="text-muted small flex-grow-1 mb-3">{job.summary}</p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="pill pill-indigo">{job.type}</span>
          {job.category && (
            <span className="pill" title="Category">
              <i className="bi bi-tag me-1"></i>{job.category}
            </span>
          )}
          <span className="pill">
            <i className="bi bi-geo-alt me-1"></i>{job.location}
          </span>
          {applied && (
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill d-inline-flex align-items-center px-2 py-1">
              <i className="bi bi-check-circle-fill me-1"></i> Applied
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
          <span className="fw-semibold small">{job.pay}</span>
          <Link to={`/jobs/${job.id}`} className="btn btn-outline-indigo btn-sm rounded-pill px-3">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
