import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import { jobs } from "../data/jobs.js";

export default function JobDetails() {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === Number(id));
  const [saved, setSaved] = useState(false);

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-emoji-frown display-4 text-muted"></i>
        <h2 className="mt-3">Job not found</h2>
        <p className="text-muted">This job may have been removed.</p>
        <Link to="/jobs" className="btn btn-indigo rounded-pill px-4">Back to all jobs</Link>
      </div>
    );
  }

  const similar = jobs.filter((j) => j.type === job.type && j.id !== job.id).slice(0, 3);

  return (
    <div className="container py-4">
      <Link to="/jobs" className="text-decoration-none small"><i className="bi bi-arrow-left me-1"></i>Back to jobs</Link>

      <div className="row g-4 mt-1">
        <div className="col-lg-8">
          <div className="detail-card">
            <div className="d-flex align-items-center mb-3">
              <div className="logo-badge logo-lg me-3" style={{ background: job.color }}>{job.company.charAt(0)}</div>
              <div>
                <h1 className="h3 fw-bold mb-0">{job.title}</h1>
                <span className="text-muted">{job.company}</span>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="pill pill-indigo">{job.type}</span>
              <span className="pill"><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
              <span className="pill"><i className="bi bi-cash me-1"></i>{job.pay}</span>
              <span className="pill"><i className="bi bi-clock me-1"></i>Posted {job.posted}</span>
            </div>

            <h5 className="fw-bold">About the role</h5>
            <p className="text-muted">{job.about}</p>

            <h5 className="fw-bold mt-4">What you will do</h5>
            <ul className="text-muted">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>

            <h5 className="fw-bold mt-4">What we look for</h5>
            <ul className="text-muted">{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>

            <h5 className="fw-bold mt-4">Skills</h5>
            <div className="d-flex flex-wrap gap-2">
              {job.skills.map((s) => <span key={s} className="pill pill-indigo">{s}</span>)}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="detail-card side-card">
            <h5 className="fw-bold mb-3">Interested?</h5>
            <Link to="/login" className="btn btn-indigo w-100 rounded-pill mb-2">Log in to apply</Link>
            <button
              className={"btn w-100 rounded-pill " + (saved ? "btn-indigo-soft" : "btn-outline-indigo")}
              onClick={() => setSaved(!saved)}
            >
              <i className={"bi me-2 " + (saved ? "bi-bookmark-check-fill" : "bi-bookmark")}></i>
              {saved ? "Saved" : "Save job"}
            </button>
            <p className="small text-muted mt-3 mb-0">
              Applications and saved jobs will be stored in your account in a later phase.
            </p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-3">Similar jobs</h4>
          <div className="row g-4">
            {similar.map((j) => (
              <div className="col-md-6 col-lg-4" key={j.id}><JobCard job={j} /></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
