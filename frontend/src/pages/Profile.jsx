import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../context/JobContext.jsx";

export default function Profile() {
  const { profile, updateProfile, applications, savedJobs, isAuthenticated } = useJobs();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    college: profile?.college || "",
    degree: profile?.degree || "",
    gradYear: profile?.gradYear || "2026",
    location: profile?.location || "Bengaluru, India",
    bio: profile?.bio || "",
    skills: profile?.skills || ["React", "JavaScript", "Python"],
    github: profile?.github || "",
    linkedin: profile?.linkedin || "",
    portfolio: profile?.portfolio || "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        college: profile.college || "",
        degree: profile.degree || "",
        gradYear: profile.gradYear || "2026",
        location: profile.location || "Bengaluru, India",
        bio: profile.bio || "",
        skills: profile.skills && profile.skills.length > 0 ? profile.skills : ["React", "JavaScript", "Python"],
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        portfolio: profile.portfolio || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const skillTrimmed = newSkill.trim();
    if (skillTrimmed && !formData.skills.some((s) => s.toLowerCase() === skillTrimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillTrimmed],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
    setSuccessMsg("Profile details saved successfully in MongoDB!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="benefit-card mx-auto p-5" style={{ maxWidth: "540px" }}>
          <i className="bi bi-person-x display-3 text-indigo mb-3"></i>
          <h2 className="fw-bold mb-2">Sign in to View Profile</h2>
          <p className="text-muted mb-4">
            Sign in to manage your student profile, skills, and academic background stored in MongoDB.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/login" className="btn btn-indigo rounded-pill px-4">
              <i className="bi bi-box-arrow-in-right me-1"></i> Log In
            </Link>
            <Link to="/signup" className="btn btn-outline-indigo rounded-pill px-4">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="page-header py-4">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h1 className="fw-bold mb-1">Student Profile</h1>
              <p className="hero-text mb-0">Manage your education, skills, and contact information.</p>
            </div>
            <Link to="/dashboard" className="btn btn-outline-light rounded-pill px-3">
              <i className="bi bi-speedometer2 me-1"></i> Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {successMsg && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
            <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Profile Summary Card */}
          <div className="col-lg-4">
            <div className="benefit-card mb-4 text-center p-4">
              <div
                className="logo-badge logo-lg mx-auto mb-3"
                style={{
                  background: "linear-gradient(135deg, var(--navy), var(--indigo))",
                  fontSize: "1.8rem",
                  width: "72px",
                  height: "72px",
                }}
              >
                {(formData.name || "S").charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold mb-1">{formData.name || "Student Name"}</h4>
              <p className="text-muted small mb-2">{formData.email}</p>
              <div className="d-flex justify-content-center gap-1 mb-3">
                <span className="pill pill-indigo small">{formData.degree || "Student"}</span>
              </div>
              <p className="text-muted small px-2">
                {formData.bio || "No summary added yet. Add a short bio to introduce yourself."}
              </p>

              <hr className="my-3 text-light-emphasis" />

              <div className="row g-2 text-center text-secondary small">
                <div className="col-6">
                  <div className="fw-bold text-dark fs-5">{applications.length}</div>
                  <div>Applications</div>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-dark fs-5">{savedJobs.length}</div>
                  <div>Saved Jobs</div>
                </div>
              </div>

              {(formData.github || formData.linkedin || formData.portfolio) && (
                <div className="d-flex justify-content-center gap-3 mt-3 pt-3 border-top">
                  {formData.github && (
                    <a href={formData.github} target="_blank" rel="noreferrer" className="text-secondary fs-5" title="GitHub">
                      <i className="bi bi-github"></i>
                    </a>
                  )}
                  {formData.linkedin && (
                    <a href={formData.linkedin} target="_blank" rel="noreferrer" className="text-primary fs-5" title="LinkedIn">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  )}
                  {formData.portfolio && (
                    <a href={formData.portfolio} target="_blank" rel="noreferrer" className="text-success fs-5" title="Portfolio / Website">
                      <i className="bi bi-globe"></i>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="card p-3 rounded-4 border-0 bg-light shadow-sm">
              <div className="d-flex align-items-center">
                <i className="bi bi-database-check text-primary fs-4 me-2"></i>
                <div className="small text-muted">
                  Your profile details are stored securely in MongoDB and automatically pre-fill internship application forms.
                </div>
              </div>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="col-lg-8">
            <div className="detail-card">
              <h4 className="fw-bold mb-3">Personal & Academic Details</h4>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Basic Info */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="pname">Full Name</label>
                    <input
                      id="pname"
                      name="name"
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="pemail">Email Address</label>
                    <input
                      id="pemail"
                      name="email"
                      type="email"
                      className="form-control"
                      disabled
                      value={formData.email}
                      title="Email is bound to your account credentials"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="pphone">Contact Phone</label>
                    <input
                      id="pphone"
                      name="phone"
                      type="text"
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="plocation">Location (City, Country)</label>
                    <input
                      id="plocation"
                      name="location"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Bengaluru, India"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Education */}
                  <div className="col-12 mt-4">
                    <h5 className="fw-bold mb-2">Education Background</h5>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="pcollege">College / University</label>
                    <input
                      id="pcollege"
                      name="college"
                      type="text"
                      className="form-control"
                      placeholder="e.g. National Institute of Technology"
                      value={formData.college}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold" htmlFor="pdegree">Degree & Branch</label>
                    <input
                      id="pdegree"
                      name="degree"
                      type="text"
                      className="form-control"
                      placeholder="e.g. B.Tech Computer Science"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label small fw-semibold" htmlFor="pgrad">Graduation</label>
                    <select
                      id="pgrad"
                      name="gradYear"
                      className="form-select"
                      value={formData.gradYear}
                      onChange={handleChange}
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>

                  {/* Skills Section */}
                  <div className="col-12 mt-4">
                    <h5 className="fw-bold mb-2">Technical & Soft Skills</h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {formData.skills.map((skill) => (
                        <span key={skill} className="pill pill-indigo d-inline-flex align-items-center gap-2 px-3 py-1">
                          {skill}
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: "0.5rem" }}
                            aria-label={`Remove ${skill}`}
                            onClick={() => handleRemoveSkill(skill)}
                          ></button>
                        </span>
                      ))}
                    </div>

                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a new skill (e.g. React, Docker, Figma)..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill(e);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-indigo px-4 text-nowrap rounded-pill"
                        onClick={handleAddSkill}
                      >
                        <i className="bi bi-plus-lg me-1"></i> Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Bio & Social Links */}
                  <div className="col-12 mt-4">
                    <h5 className="fw-bold mb-2">Professional Links & Bio</h5>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold" htmlFor="pgithub">GitHub Profile URL</label>
                    <input
                      id="pgithub"
                      name="github"
                      type="url"
                      className="form-control"
                      placeholder="https://github.com/..."
                      value={formData.github}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold" htmlFor="plinkedin">LinkedIn URL</label>
                    <input
                      id="plinkedin"
                      name="linkedin"
                      type="url"
                      className="form-control"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold" htmlFor="pportfolio">Portfolio / Resume Link</label>
                    <input
                      id="pportfolio"
                      name="portfolio"
                      type="url"
                      className="form-control"
                      placeholder="https://yourportfolio.dev"
                      value={formData.portfolio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold" htmlFor="pbio">Short Professional Bio</label>
                    <textarea
                      id="pbio"
                      name="bio"
                      rows="3"
                      className="form-control"
                      placeholder="Introduce your interests, target roles, or key achievements..."
                      value={formData.bio}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <Link to="/dashboard" className="btn btn-outline-secondary rounded-pill px-4">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-indigo rounded-pill px-5" disabled={saving}>
                    {saving ? (
                      <span><span className="spinner-border spinner-border-sm me-2"></span>Saving to MongoDB...</span>
                    ) : (
                      <span><i className="bi bi-save2 me-1"></i> Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
