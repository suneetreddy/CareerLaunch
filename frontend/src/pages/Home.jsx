import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import { jobs } from "../data/jobs.js";

const popular = ["React", "Data", "Design", "Marketing"];

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const featured = jobs.filter((j) => j.featured);
  const companies = new Set(jobs.map((j) => j.company)).size;
  const internships = jobs.filter((j) => j.type === "Internship").length;

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {/* Hero */}
      <section className="cl-hero">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-4">
            <div className="col-lg-7">
              <h1 className="display-4 fw-bold mb-3">Find the internship that starts your career.</h1>
              <p className="lead hero-text mb-4">
                Browse internships and entry-level jobs from companies that hire students and freshers.
              </p>
              <form className="cl-search d-flex" onSubmit={handleSearch}>
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder="Job title, skill or company"
                  aria-label="Search jobs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-indigo rounded-pill px-4">Search</button>
              </form>
              <div className="mt-3 hero-text small">
                Popular searches:{" "}
                {popular.map((p) => (
                  <Link key={p} to={`/jobs?q=${p}`} className="chip">{p}</Link>
                ))}
              </div>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/jobs" className="btn btn-light btn-lg rounded-pill px-4 fw-semibold">Browse all jobs</Link>
                <Link to="/signup" className="btn btn-outline-light btn-lg rounded-pill px-4">Create free account</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="fresh-panel">
                <h6 className="fw-bold mb-3">Fresh this week</h6>
                {jobs.slice(0, 3).map((j) => (
                  <Link to={`/jobs/${j.id}`} key={j.id} className="fresh-item">
                    <div className="logo-badge me-3" style={{ background: j.color }}>{j.company.charAt(0)}</div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{j.title}</div>
                      <div className="text-muted small">{j.company}, {j.location}</div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container stats-strip">
        <div className="row g-3 text-center">
          <div className="col-6 col-md-3"><div className="stat-num">{jobs.length}</div><div className="text-muted small">Open roles</div></div>
          <div className="col-6 col-md-3"><div className="stat-num">{companies}</div><div className="text-muted small">Hiring companies</div></div>
          <div className="col-6 col-md-3"><div className="stat-num">{internships}</div><div className="text-muted small">Internships</div></div>
          <div className="col-6 col-md-3"><div className="stat-num">5</div><div className="text-muted small">Cities and remote</div></div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-5 mt-4">
        <h2 className="section-title text-center mb-1">Built for students</h2>
        <p className="text-muted text-center mb-5">Everything you need to find your first role.</p>
        <div className="row g-4">
          {[
            ["bi-mortarboard", "Made for freshers", "Every listing says who can apply, so you know if a role fits you."],
            ["bi-funnel", "Find roles faster", "Filter by job type and location to see only what matters to you."],
            ["bi-list-check", "Clear job details", "See responsibilities, requirements and skills before you decide."],
          ].map(([icon, title, text]) => (
            <div className="col-md-4" key={title}>
              <div className="benefit-card h-100">
                <div className="benefit-icon"><i className={`bi ${icon}`}></i></div>
                <h5 className="fw-bold">{title}</h5>
                <p className="text-muted mb-0">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="soft-bg py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="section-title mb-1">Featured jobs</h2>
              <p className="text-muted mb-0">Hand-picked roles to get you started.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-indigo rounded-pill px-4 d-none d-sm-inline-block">View all jobs</Link>
          </div>
          <div className="row g-4">
            {featured.map((job) => (
              <div className="col-md-6 col-lg-4" key={job.id}><JobCard job={job} /></div>
            ))}
          </div>
          <div className="text-center mt-4 d-sm-none">
            <Link to="/jobs" className="btn btn-outline-indigo rounded-pill px-4">View all jobs</Link>
          </div>
        </div>
      </section>
    </>
  );
}
