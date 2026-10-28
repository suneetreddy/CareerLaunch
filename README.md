# CareerLaunch — Internship and Job Portal

A student-friendly internship and job portal built as a college project using **React + Vite** on the frontend and **Express** on the backend. Designed specifically for college students and freshers seeking internships, full-time trainee positions, and entry-level jobs.

---

## 🚀 Key Features Implemented

### 1. Job & Internship Listings
- Realistic dataset of internships and early-career roles across engineering, data science, UI/UX design, product management, QA, and marketing.
- Each listing includes company name, location, job type, monthly stipend or salary, eligibility requirements, responsibilities, and required skills.

### 2. Live Search & Multi-Filter System
- **Keyword Search**: Search dynamically by role title, company name, or tech skills (e.g. *React*, *Figma*, *Python*).
- **3-Way Filtering**:
  - **Category**: *Software Development*, *Data & Analytics*, *Design & UI/UX*, *Product & QA*, *Marketing & Content*, *Operations & Support*.
  - **Job Type**: *Internship*, *Full-time*, *Part-time*.
  - **Location**: *Bengaluru*, *Hyderabad*, *Pune*, *Chennai*, *Remote*.
- Results counter with a one-click "Clear all filters" button and empty-state handling.

### 3. Job Details & Application Workflow
- Comprehensive job breakdown with responsibilities, qualifications, and company overview.
- **Interactive Application Modal**:
  - Automatically pre-fills candidate details from the student's profile.
  - Form validation for candidate name, email, phone number, college, degree, graduation year, and resume/portfolio link.
  - Initial submission status is automatically logged as **Pending** with a generated application reference number.
- **Duplicate Prevention**: Intelligently detects previously applied positions and disables re-submission with an "Applied" badge.

### 4. Bookmark & Saved Jobs
- Save or unsave any job directly from the `JobCard` or from the `JobDetails` page.
- View and manage bookmarked jobs under the **Saved Jobs** tab on the Dashboard.

### 5. Application Tracking Dashboard
- **Key Metrics Overview**:
  - Total Available Roles
  - Submitted Applications
  - Saved Bookmarks
  - Accepted Offers count
- **Tracking Table**:
  - Live status tracking with color-coded badges: **Pending** (amber), **Accepted** (green), **Rejected** (red).
  - Modal viewer to inspect submitted application details (resume link, cover note, degree, batch).
  - **Presentation / Viva Mode**: Dynamic status switcher allowing you to toggle application statuses live during project demonstrations to showcase real-time UI updates.
  - Application withdrawal with confirmation.
- **Skill-Based Recommendations**: Automatically highlights jobs that match skills listed in your profile.

### 6. Editable Student Profile
- Manage student details: Full Name, Email, Phone, College/University, Degree, Branch, and Graduation Year.
- **Interactive Skill Tag Editor**: Add and remove technical/soft skills dynamically.
- Social links: GitHub, LinkedIn, Portfolio/Resume URL, and a short professional bio.

### 7. Persistent Local Storage
- All saved bookmarks, submitted applications, and profile edits are saved to browser `localStorage` (`cl_saved_jobs`, `cl_applications`, `cl_profile`).
- Data persists across browser refreshes and page navigation.
- Includes a "Reset Demo Data" option on the Dashboard to return to initial showcase state at any time.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM (v6), Bootstrap 5.3, Bootstrap Icons
- **Backend**: Node.js, Express, CORS, Dotenv
- **Storage**: Browser `localStorage` (Zero database installation required; no MongoDB Atlas needed)

---

## 💻 Quick Start on Windows (PowerShell)

### Prerequisites
- [Node.js LTS](https://nodejs.org/) installed
- Visual Studio Code or any code editor

### Step 1: Open the Project
Open PowerShell and navigate to the project directory:
```powershell
cd CareerLaunch
```

### Step 2: Run the Frontend (Terminal 1)
```powershell
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Step 3: Run the Backend (Terminal 2 - Optional)
```powershell
cd backend
npm install
npm run dev
```
The Express API runs at **`http://localhost:5000`**.

### Verify Backend Health & API Endpoints
Open a PowerShell terminal or browser tab:
```powershell
# Health Check
Invoke-RestMethod http://localhost:5000/api/health

# Fetch All Jobs
Invoke-RestMethod http://localhost:5000/api/jobs

# Fetch Single Job
Invoke-RestMethod http://localhost:5000/api/jobs/1
```

---

## 📁 Project Structure

```
CareerLaunch/
├── backend/
│   ├── data/
│   │   └── jobs.json         # Realistic job listings for Express API
│   ├── server.js             # Express API server with /api/health & /api/jobs
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Responsive header with notification toast & badges
│   │   │   ├── JobCard.jsx   # Card with bookmark toggle & applied indicator
│   │   │   └── Footer.jsx    # Footer with quick navigation
│   │   ├── context/
│   │   │   └── JobContext.jsx# Centralized state & localStorage persistence
│   │   ├── data/
│   │   │   └── jobs.js       # Student job dataset with categories & types
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Hero, live search, stats, featured jobs
│   │   │   ├── Jobs.jsx      # Search and 3-way filtering page
│   │   │   ├── JobDetails.jsx# Role overview & application modal
│   │   │   ├── Dashboard.jsx # Applications tracker, metrics, saved jobs
│   │   │   ├── Profile.jsx   # Student profile & interactive skills editor
│   │   │   ├── Login.jsx     # Demo login page
│   │   │   ├── Register.jsx  # Student signup page
│   │   │   └── NotFound.jsx  # 404 page
│   │   ├── App.jsx           # Routes and provider setup
│   │   ├── main.jsx
│   │   └── index.css         # Bootstrap custom styling & animations
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🎓 College Demonstration Guide

When presenting this project for evaluation or viva:

1. **Home Page (`/`)**:
   - Show the hero banner, fast keyword searches (click "React" or "Design"), and platform statistics.
2. **Find Jobs (`/jobs`)**:
   - Filter by **Category** (e.g. *Software Development*), **Job Type** (*Internship*), and **Location** (*Bengaluru*).
   - Show how the results update instantly and how clicking the bookmark icon saves a job.
3. **Job Details & Application Form (`/jobs/1`)**:
   - Click a job to view responsibilities and skills.
   - Click **"Apply for this role"** to open the modal. Show that student profile fields are auto-populated.
   - Submit the application and demonstrate that duplicate applications are now locked.
4. **Dashboard (`/dashboard`)**:
   - Show the 4 metric cards (Available Roles, Applications, Bookmarks, Offers).
   - In the applications table, demonstrate the **Demo Status Action** dropdown by switching an application from *Pending* to *Accepted* or *Rejected*.
   - Switch to the **Saved Jobs** tab to view bookmarked opportunities.
5. **Profile Page (`/profile`)**:
   - Add a new skill (e.g. *Docker* or *TypeScript*) and update contact info. Click **Save Changes** and refresh the page to prove persistence in `localStorage`.
