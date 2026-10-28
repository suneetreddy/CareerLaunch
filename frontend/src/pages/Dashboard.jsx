import { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import { useJobs } from "../context/JobContext.jsx";

export default function Dashboard() {
  const {
    jobs,
    savedJobs,
    applications,
    profile,
    unsaveJob,
    withdrawApplication,
    updateApplicationStatus,
    resetDemoData
  } = useJobs();

  const [activeTab, setActiveTab] = useState("applications"); // 'applications' | 'saved'
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null); // for viewing application details modal

  // Calculate statistics
  const totalJobsCount = jobs.length;
  const savedJobsCount = savedJobs.length;
  const totalApplicationsCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "Pending").length;
  const acceptedCount = applications.filter((a) => a.status === "Accepted").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (statusFilter === "All") return true;
    return app.status === statusFilter;
  });

  // Filtered saved jobs
  const savedJobsList = jobs.filter((job) => savedJobs.includes(job.id));

  // Recommended jobs based on student profile skills
  const studentSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const recommendedJobs = jobs
    .filter((job) => {
      const matchesSkill = job.skills.some((s) => studentSkills.includes(s.toLowerCase()));
      const alreadyApplied = applications.some((a) => Number(a.jobId) === Number(job.id));
      return matchesSkill && !alreadyApplied;
    })
    .slice(0, 3);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-check-circle-fill me-1"></i> Accepted</span>;
      case "Rejected":
        return <span className="badge bg-danger px-3 py-2 rounded-pill"><i className="bi bi-x-circle-fill me-1"></i> Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-clock-history me-1"></i> Pending</span>;
    }
  };

  return (
    <>
      {/* Header */}
      <section className="page-header py-4">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="fw-bold mb-1">Student Dashboard</h1>
              <p className="hero-text mb-0">
                Welcome back, <span className="text-white fw-semibold">{profile.name || "Student"}</span>! Track your progress and opportunities.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/profile" className="btn btn-light rounded-pill px-3">
                <i className="bi bi-person-circle me-1"></i> Edit Profile
              </Link>
              <Link to="/jobs" className="btn btn-outline-light rounded-pill px-3">
                <i className="bi bi-search me-1"></i> Find Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {/* Metric Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="benefit-card h-100 p-3 text-center">
              <div className="benefit-icon mx-auto mb-2" style={{ width: "42px", height: "42px" }}>
                <i className="bi bi-briefcase"></i>
              </div>
              <div className="stat-num fs-3">{totalJobsCount}</div>
              <div className="text-muted small">Total Available Roles</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="benefit-card h-100 p-3 text-center">
              <div className="benefit-icon mx-auto mb-2" style={{ width: "42px", height: "42px", background: "#e0f2fe", color: "#0284c7" }}>
                <i className="bi bi-send-check"></i>
              </div>
              <div className="stat-num fs-3">{totalApplicationsCount}</div>
              <div className="text-muted small">Submitted Applications</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="benefit-card h-100 p-3 text-center">
              <div className="benefit-icon mx-auto mb-2" style={{ width: "42px", height: "42px", background: "#fef3c7", color: "#d97706" }}>
                <i className="bi bi-bookmark-star"></i>
              </div>
              <div className="stat-num fs-3">{savedJobsCount}</div>
              <div className="text-muted small">Saved Bookmarks</div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="benefit-card h-100 p-3 text-center">
              <div className="benefit-icon mx-auto mb-2" style={{ width: "42px", height: "42px", background: "#dcfce7", color: "#16a34a" }}>
                <i className="bi bi-award"></i>
              </div>
              <div className="stat-num fs-3 text-success">{acceptedCount}</div>
              <div className="text-muted small">Offers / Accepted</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-4 gap-2">
          <ul className="nav nav-pills gap-2">
            <li className="nav-item">
              <button
                className={`btn rounded-pill px-4 ${activeTab === "applications" ? "btn-indigo" : "btn-light text-dark"}`}
                onClick={() => setActiveTab("applications")}
              >
                <i className="bi bi-file-earmark-text me-2"></i>My Applications ({totalApplicationsCount})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn rounded-pill px-4 ${activeTab === "saved" ? "btn-indigo" : "btn-light text-dark"}`}
                onClick={() => setActiveTab("saved")}
              >
                <i className="bi bi-bookmark-heart me-2"></i>Saved Jobs ({savedJobsCount})
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill"
              onClick={resetDemoData}
              title="Reset all demo data back to factory state"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>Reset Demo Data
            </button>
          </div>
        </div>

        {/* TAB 1: Applications */}
        {activeTab === "applications" && (
          <div>
            {/* Filter by Status */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted fw-semibold">Filter Status:</span>
                {["All", "Pending", "Accepted", "Rejected"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      statusFilter === s ? "btn-outline-indigo active" : "btn-light border"
                    }`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="small text-muted">
                Showing {filteredApps.length} of {applications.length} applications
              </div>
            </div>

            {filteredApps.length > 0 ? (
              <div className="card border rounded-4 shadow-sm overflow-hidden mb-4">
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead className="table-light small text-uppercase text-secondary">
                      <tr>
                        <th className="ps-4">Job Role & Company</th>
                        <th>Type & Location</th>
                        <th>Applied Date</th>
                        <th>Tracking Status</th>
                        <th>Demo Status Action</th>
                        <th className="pe-4 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApps.map((app) => (
                        <tr key={app.id}>
                          <td className="ps-4">
                            <div className="fw-bold text-dark">{app.jobTitle}</div>
                            <div className="text-muted small">
                              <i className="bi bi-building me-1"></i>{app.company}
                              <span className="ms-2 badge bg-light text-secondary border">Ref: {app.id}</span>
                            </div>
                          </td>
                          <td>
                            <div><span className="pill pill-indigo py-0 px-2 small">{app.type}</span></div>
                            <small className="text-muted"><i className="bi bi-geo-alt me-1"></i>{app.location}</small>
                          </td>
                          <td>
                            <div className="small text-dark fw-medium">{app.appliedAt}</div>
                          </td>
                          <td>
                            {getStatusBadge(app.status)}
                          </td>
                          <td>
                            {/* Demo dropdown to change status for live college demonstration */}
                            <select
                              className="form-select form-select-sm rounded-pill"
                              style={{ width: "130px", fontSize: "0.8rem" }}
                              value={app.status}
                              onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                              title="College demo: quickly switch application status to test visual feedback"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="pe-4 text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill me-1"
                                onClick={() => setSelectedApp(app)}
                                title="View Application Details"
                              >
                                <i className="bi bi-eye"></i> Details
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger rounded-pill"
                                onClick={() => {
                                  if (window.confirm(`Withdraw application for ${app.jobTitle}?`)) {
                                    withdrawApplication(app.id);
                                  }
                                }}
                                title="Withdraw application"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="empty-box text-center bg-white p-5 my-3">
                <i className="bi bi-inbox display-4 text-muted"></i>
                <h5 className="mt-3 fw-bold">No applications found</h5>
                <p className="text-muted mx-auto" style={{ maxWidth: "400px" }}>
                  {statusFilter === "All"
                    ? "You haven't submitted any job applications yet. Browse our open listings to apply!"
                    : `No applications currently marked with status "${statusFilter}".`}
                </p>
                <Link to="/jobs" className="btn btn-indigo rounded-pill px-4 mt-2">
                  <i className="bi bi-search me-1"></i> Browse Open Jobs
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Saved Jobs */}
        {activeTab === "saved" && (
          <div>
            {savedJobsList.length > 0 ? (
              <div className="row g-4">
                {savedJobsList.map((job) => (
                  <div className="col-md-6 col-lg-4" key={job.id}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-box text-center bg-white p-5 my-3">
                <i className="bi bi-bookmark display-4 text-muted"></i>
                <h5 className="mt-3 fw-bold">No saved jobs yet</h5>
                <p className="text-muted mx-auto" style={{ maxWidth: "420px" }}>
                  Keep track of interesting internships and jobs by clicking the bookmark icon on any job card.
                </p>
                <Link to="/jobs" className="btn btn-indigo rounded-pill px-4 mt-2">
                  <i className="bi bi-search me-1"></i> Explore Jobs
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Recommended Jobs Section */}
        {recommendedJobs.length > 0 && (
          <div className="mt-5 pt-3">
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <h4 className="fw-bold mb-1">Recommended for You</h4>
                <p className="text-muted small mb-0">
                  Matches your profile skills: {profile.skills.slice(0, 4).join(", ")}
                </p>
              </div>
              <Link to="/jobs" className="btn btn-outline-indigo btn-sm rounded-pill px-3">
                View all
              </Link>
            </div>
            <div className="row g-4">
              {recommendedJobs.map((job) => (
                <div className="col-md-6 col-lg-4" key={job.id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 27, 61, 0.65)" }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light border-0 p-4">
                <div>
                  <span className="small text-muted">Reference: {selectedApp.id}</span>
                  <h5 className="modal-title fw-bold">{selectedApp.jobTitle}</h5>
                  <span className="text-secondary small">{selectedApp.company} &bull; {selectedApp.location}</span>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedApp(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3 border">
                  <span className="text-muted small">Current Application Status</span>
                  {getStatusBadge(selectedApp.status)}
                </div>

                <div className="mb-2">
                  <span className="text-muted small d-block">Applicant Name</span>
                  <strong className="text-dark">{selectedApp.applicantName}</strong>
                </div>

                <div className="mb-2">
                  <span className="text-muted small d-block">Contact Info</span>
                  <div>{selectedApp.email} | {selectedApp.phone}</div>
                </div>

                <div className="mb-2">
                  <span className="text-muted small d-block">College & Degree</span>
                  <div>{selectedApp.degree} &bull; {selectedApp.college} (Batch {selectedApp.gradYear})</div>
                </div>

                <div className="mb-3">
                  <span className="text-muted small d-block">Resume / Portfolio</span>
                  <a
                    href={selectedApp.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-break small fw-semibold"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    {selectedApp.resumeLink}
                  </a>
                </div>

                {selectedApp.coverNote && (
                  <div className="p-3 bg-light rounded-3 border small">
                    <strong className="d-block mb-1 text-secondary">Applicant Note:</strong>
                    <p className="mb-0 text-muted fst-italic">"{selectedApp.coverNote}"</p>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 p-3 bg-light">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
