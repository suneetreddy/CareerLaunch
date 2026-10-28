import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import { jobs, jobTypes, locations } from "../data/jobs.js";

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState("All");
  const [location, setLocation] = useState("All");

  const text = query.trim().toLowerCase();
  const results = jobs.filter((job) => {
    const matchesText =
      text === "" ||
      job.title.toLowerCase().includes(text) ||
      job.company.toLowerCase().includes(text) ||
      job.skills.some((s) => s.toLowerCase().includes(text));
    const matchesType = type === "All" || job.type === type;
    const matchesLocation = location === "All" || job.location === location;
    return matchesText && matchesType && matchesLocation;
  });

  const clearFilters = () => {
    setQuery("");
    setType("All");
    setLocation("All");
  };

  return (
    <>
      <section className="page-header">
        <div className="container py-4">
          <h1 className="fw-bold mb-1">Find jobs</h1>
          <p className="hero-text mb-0">Search internships and entry-level roles.</p>
        </div>
      </section>

      <div className="container py-4">
        <div className="filter-card mb-4">
          <div className="row g-3">
            <div className="col-lg-6">
              <label className="form-label small fw-semibold" htmlFor="q">Search</label>
              <input id="q" className="form-control" placeholder="Job title, skill or company"
                value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label small fw-semibold" htmlFor="type">Job type</label>
              <select id="type" className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All types</option>
                {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label small fw-semibold" htmlFor="loc">Location</label>
              <select id="loc" className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="All">All locations</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">{results.length} {results.length === 1 ? "job" : "jobs"} found</span>
          <button className="btn btn-link text-decoration-none p-0" onClick={clearFilters}>Clear filters</button>
        </div>

        {results.length > 0 ? (
          <div className="row g-4">
            {results.map((job) => (
              <div className="col-md-6 col-lg-4" key={job.id}><JobCard job={job} /></div>
            ))}
          </div>
        ) : (
          <div className="empty-box text-center">
            <i className="bi bi-search display-5 text-muted"></i>
            <h5 className="mt-3">No jobs match your search</h5>
            <p className="text-muted">Try a different keyword or clear the filters.</p>
            <button className="btn btn-indigo rounded-pill px-4" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </div>
    </>
  );
}
