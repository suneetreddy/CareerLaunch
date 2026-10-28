import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import { useJobs } from "../context/JobContext.jsx";
import { categories, jobTypes, locations } from "../data/jobs.js";

export default function Jobs() {
  const { jobs } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [type, setType] = useState(searchParams.get("type") || "All");
  const [location, setLocation] = useState(searchParams.get("location") || "All");

  // Keep query params synced when arriving from hero/popular search links
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setQuery(q);
    const cat = searchParams.get("category");
    if (cat !== null) setCategory(cat);
  }, [searchParams]);

  const text = query.trim().toLowerCase();
  const results = jobs.filter((job) => {
    const matchesText =
      text === "" ||
      job.title.toLowerCase().includes(text) ||
      job.company.toLowerCase().includes(text) ||
      (job.skills && job.skills.some((s) => s.toLowerCase().includes(text)));
    const matchesCategory = category === "All" || job.category === category;
    const matchesType = type === "All" || job.type === type;
    const matchesLocation = location === "All" || job.location === location;
    return matchesText && matchesCategory && matchesType && matchesLocation;
  });

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setType("All");
    setLocation("All");
    setSearchParams({});
  };

  const hasActiveFilters = query.trim() !== "" || category !== "All" || type !== "All" || location !== "All";

  return (
    <>
      <section className="page-header">
        <div className="container py-4">
          <h1 className="fw-bold mb-1">Find jobs & internships</h1>
          <p className="hero-text mb-0">Search verified student roles across companies.</p>
        </div>
      </section>

      <div className="container py-4">
        {/* Filters Card */}
        <div className="filter-card mb-4">
          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <label className="form-label small fw-semibold" htmlFor="q">
                <i className="bi bi-search me-1"></i>Search
              </label>
              <input
                id="q"
                type="text"
                className="form-control"
                placeholder="Job title, company, or skill..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-4 col-lg-3">
              <label className="form-label small fw-semibold" htmlFor="cat">
                <i className="bi bi-tag me-1"></i>Category
              </label>
              <select
                id="cat"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-sm-4 col-lg-2">
              <label className="form-label small fw-semibold" htmlFor="type">
                <i className="bi bi-briefcase me-1"></i>Job type
              </label>
              <select
                id="type"
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="All">All types</option>
                {jobTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-sm-4 col-lg-3">
              <label className="form-label small fw-semibold" htmlFor="loc">
                <i className="bi bi-geo-alt me-1"></i>Location
              </label>
              <select
                id="loc"
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="All">All locations</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold text-dark">
              {results.length} {results.length === 1 ? "job" : "jobs"} found
            </span>
            {hasActiveFilters && (
              <span className="badge bg-light text-secondary border">Filters applied</span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              className="btn btn-sm btn-link text-decoration-none p-0 text-muted"
              onClick={clearFilters}
            >
              <i className="bi bi-x-circle me-1"></i>Clear all filters
            </button>
          )}
        </div>

        {/* Jobs Grid or Empty State */}
        {results.length > 0 ? (
          <div className="row g-4">
            {results.map((job) => (
              <div className="col-md-6 col-lg-4" key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-box text-center bg-white my-4 p-5">
            <i className="bi bi-search display-5 text-muted"></i>
            <h5 className="mt-3 fw-bold">No jobs match your criteria</h5>
            <p className="text-muted mx-auto" style={{ maxWidth: "420px" }}>
              We could not find any jobs matching your search and filter options. Try adjusting your keywords or clearing the filters.
            </p>
            <button className="btn btn-indigo rounded-pill px-4 mt-2" onClick={clearFilters}>
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
