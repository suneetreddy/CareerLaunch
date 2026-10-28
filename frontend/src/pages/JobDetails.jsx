import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import { useJobs } from "../context/JobContext.jsx";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, isJobSaved, toggleSaveJob, hasApplied, getApplication, applyToJob, profile, isAuthenticated } = useJobs();

  // Find job by either numeric id, legacyId, or MongoDB _id
  const job = jobs.find((j) => String(j.id) === String(id) || String(j._id) === String(id));

  // Application Modal & Form state
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    applicantName: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    college: profile?.college || "",
    degree: profile?.degree || "",
    gradYear: profile?.gradYear || "2026",
    resumeLink: profile?.portfolio || "https://github.com/student-demo",
    coverNote: "",
  });

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-emoji-frown display-4 text-muted"></i>
        <h2 className="mt-3 fw-bold">Job not found</h2>
        <p className="text-muted">This job listing may have been removed or does not exist.</p>
        <Link to="/jobs" className="btn btn-indigo rounded-pill px-4">
          <i className="bi bi-arrow-left me-1"></i>Back to all jobs
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id || job._id);
  const alreadyApplied = hasApplied(job.id || job._id);
  const existingApp = getApplication(job.id || job._id);
  const similar = jobs
    .filter((j) => (j.category === job.category || j.type === job.type) && String(j.id || j._id) !== String(job.id || job._id))
    .slice(0, 3);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setFormData({
      applicantName: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      college: profile?.college || "",
      degree: profile?.degree || "",
      gradYear: profile?.gradYear || "2026",
      resumeLink: profile?.portfolio || "https://github.com/student-demo",
      coverNote: "",
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.applicantName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("Please provide your contact phone number.");
      return;
    }
    if (!formData.college.trim()) {
      setErrorMsg("Please enter your college or university name.");
      return;
    }
    if (!formData.resumeLink.trim()) {
      setErrorMsg("Please provide a link to your resume, portfolio, or GitHub profile.");
      return;
    }

    setSubmitting(true);
    const result = await applyToJob({
      jobId: job._id || job.id,
      jobTitle: job.title,
      company: job.company,
      category: job.category,
      location: job.location,
      type: job.type,
      ...formData,
    });
    setSubmitting(false);

    if (result.success) {
      setFormSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setFormSubmitted(false);
      }, 2000);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-3">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/jobs" className="text-decoration-none">Jobs</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{job.title}</li>
        </ol>
      </nav>

      <div className="row g-4 mt-1">
        {/* Main Details Column */}
        <div className="col-lg-8">
          <div className="detail-card">
            <div className="d-flex align-items-center mb-3">
              <div className="logo-badge logo-lg me-3" style={{ background: job.color }}>
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="h3 fw-bold mb-0">{job.title}</h1>
                <span className="text-muted fs-6">{job.company}</span>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="pill pill-indigo">{job.type}</span>
              {job.category && (
                <span className="pill">
                  <i className="bi bi-tag me-1"></i>{job.category}
                </span>
              )}
              <span className="pill">
                <i className="bi bi-geo-alt me-1"></i>{job.location}
              </span>
              <span className="pill">
                <i className="bi bi-cash me-1"></i>{job.pay}
              </span>
              <span className="pill">
                <i className="bi bi-clock me-1"></i>Posted {job.posted}
              </span>
            </div>

            <hr className="my-4 text-light-emphasis" />

            <h5 className="fw-bold mb-2">About the role</h5>
            <p className="text-muted leading-relaxed">{job.about}</p>

            <h5 className="fw-bold mt-4 mb-2">Key Responsibilities</h5>
            <ul className="text-muted mb-4 ps-3">
              {(job.responsibilities || []).map((r, i) => (
                <li key={i} className="mb-1">{r}</li>
              ))}
            </ul>

            <h5 className="fw-bold mt-4 mb-2">What we are looking for</h5>
            <ul className="text-muted mb-4 ps-3">
              {(job.requirements || []).map((r, i) => (
                <li key={i} className="mb-1">{r}</li>
              ))}
            </ul>

            <h5 className="fw-bold mt-4 mb-2">Skills & Technologies</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {(job.skills || []).map((s) => (
                <span key={s} className="pill pill-indigo">{s}</span>
              ))}
            </div>

            <div className="p-3 bg-light rounded-3 mt-4 border">
              <div className="d-flex align-items-center text-muted small">
                <i className="bi bi-shield-check text-success fs-5 me-2"></i>
                <span>Verified student-friendly role. Applications persist in MongoDB.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions Column */}
        <div className="col-lg-4">
          <div className="detail-card side-card">
            <h5 className="fw-bold mb-3">Application Action</h5>

            {alreadyApplied ? (
              <div className="p-3 mb-3 bg-success-subtle border border-success-subtle rounded-3 text-start">
                <div className="d-flex align-items-center text-success mb-2">
                  <i className="bi bi-check-circle-fill fs-5 me-2"></i>
                  <strong>Application Submitted</strong>
                </div>
                <div className="small text-secondary mb-2">
                  Reference: <code>{existingApp?.id}</code>
                </div>
                <div className="small text-secondary mb-3">
                  Status:{" "}
                  <span
                    className={`badge ${
                      existingApp?.status === "Accepted"
                        ? "bg-success"
                        : existingApp?.status === "Rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {existingApp?.status || "Pending"}
                  </span>
                </div>
                <Link to="/dashboard" className="btn btn-sm btn-outline-success w-100 rounded-pill">
                  <i className="bi bi-speedometer2 me-1"></i>Track in Dashboard
                </Link>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-indigo w-100 rounded-pill mb-2 py-2"
                onClick={handleApplyClick}
              >
                <i className="bi bi-send-fill me-2"></i>Apply for this role
              </button>
            )}

            <button
              type="button"
              className={"btn w-100 rounded-pill py-2 " + (saved ? "btn-indigo-soft" : "btn-outline-indigo")}
              onClick={() => toggleSaveJob(job._id || job.id)}
            >
              <i className={"bi me-2 " + (saved ? "bi-bookmark-check-fill" : "bi-bookmark")}></i>
              {saved ? "Saved to MongoDB" : "Save Job"}
            </button>

            {!isAuthenticated && (
              <div className="alert alert-light border small text-muted mt-3 mb-0">
                <i className="bi bi-info-circle me-1"></i> Sign in to save or apply to this opportunity.
              </div>
            )}

            <hr className="my-4" />

            <div className="small">
              <h6 className="fw-bold mb-2">Company Overview</h6>
              <div className="d-flex align-items-center mb-2 text-muted">
                <i className="bi bi-building me-2"></i> {job.company}
              </div>
              <div className="d-flex align-items-center mb-2 text-muted">
                <i className="bi bi-geo-alt me-2"></i> {job.location}
              </div>
              <div className="d-flex align-items-center text-muted">
                <i className="bi bi-currency-rupee me-2"></i> {job.pay}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {similar.length > 0 && (
        <div className="mt-5 pt-3">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h4 className="fw-bold mb-1">Similar opportunities</h4>
              <p className="text-muted small mb-0">Other roles in {job.category || job.type}</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-indigo btn-sm rounded-pill px-3">
              Browse all
            </Link>
          </div>
          <div className="row g-4">
            {similar.map((j) => (
              <div className="col-md-6 col-lg-4" key={j.id || j._id}>
                <JobCard job={j} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 27, 61, 0.65)" }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-light p-4">
                <div>
                  <span className="badge bg-indigo-subtle text-primary border mb-1">{job.type}</span>
                  <h4 className="modal-title fw-bold mb-0">Apply to {job.title}</h4>
                  <small className="text-muted">{job.company} &bull; {job.location}</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {formSubmitted ? (
                  <div className="text-center py-4">
                    <i className="bi bi-check-circle-fill text-success display-3 mb-3"></i>
                    <h4 className="fw-bold">Application Submitted Successfully!</h4>
                    <p className="text-muted mb-0">
                      Your application has been stored directly in MongoDB with initial status <strong>Pending</strong>. You can track it on your Dashboard.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit}>
                    {errorMsg && (
                      <div className="alert alert-danger py-2 small mb-3">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMsg}
                      </div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold" htmlFor="applicantName">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          id="applicantName"
                          name="applicantName"
                          type="text"
                          className="form-control"
                          required
                          value={formData.applicantName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold" htmlFor="email">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="form-control"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold" htmlFor="phone">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="text"
                          className="form-control"
                          placeholder="+91 98765 43210"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold" htmlFor="college">
                          College / University <span className="text-danger">*</span>
                        </label>
                        <input
                          id="college"
                          name="college"
                          type="text"
                          className="form-control"
                          placeholder="e.g. National Institute of Tech"
                          required
                          value={formData.college}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-8">
                        <label className="form-label small fw-semibold" htmlFor="degree">
                          Degree & Major <span className="text-danger">*</span>
                        </label>
                        <input
                          id="degree"
                          name="degree"
                          type="text"
                          className="form-control"
                          placeholder="e.g. B.Tech Computer Science"
                          required
                          value={formData.degree}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold" htmlFor="gradYear">
                          Graduation Year
                        </label>
                        <select
                          id="gradYear"
                          name="gradYear"
                          className="form-select"
                          value={formData.gradYear}
                          onChange={handleInputChange}
                        >
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold" htmlFor="resumeLink">
                          Resume Link / Portfolio / GitHub URL <span className="text-danger">*</span>
                        </label>
                        <input
                          id="resumeLink"
                          name="resumeLink"
                          type="url"
                          className="form-control"
                          placeholder="https://drive.google.com/your-resume or https://github.com/..."
                          required
                          value={formData.resumeLink}
                          onChange={handleInputChange}
                        />
                        <div className="form-text small">
                          Paste a public Google Drive resume link, personal portfolio, or GitHub profile link.
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold" htmlFor="coverNote">
                          Why are you a great fit for this role? (Optional)
                        </label>
                        <textarea
                          id="coverNote"
                          name="coverNote"
                          rows="3"
                          className="form-control"
                          placeholder="Briefly highlight relevant coursework, side projects, or tools..."
                          value={formData.coverNote}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4"
                        onClick={() => setShowModal(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-indigo rounded-pill px-4" disabled={submitting}>
                        {submitting ? (
                          <span><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</span>
                        ) : (
                          <span><i className="bi bi-send-fill me-1"></i> Submit Application</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
