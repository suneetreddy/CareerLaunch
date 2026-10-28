# CareerLaunch — Internship and Job Portal (Full MERN Stack)

A complete MERN stack (MongoDB, Express, React, Node.js) internship and job portal built as a college project. Designed for college students and freshers seeking internships, full-time trainee positions, and entry-level jobs with real database persistence, JWT authentication, and role-based access control.

---

## 🚀 Key Features Implemented (Phase 3 Full MERN)

### 1. MongoDB Database Persistence & Schema Design
- **Users Collection (`users`)**: Stores registered student and administrator accounts with bcrypt hashed passwords and unique indexed emails.
- **Jobs Collection (`jobs`)**: Stores 12+ verified student jobs with compound indexing on `(title, company)` and category/location/type indexing.
- **Saved Jobs Collection (`savedjobs`)**: Bookmarks associated with authenticated user ID, enforced with compound unique index `{ user: 1, job: 1 }`.
- **Applications Collection (`applications`)**: Tracks student applications with resume links, cover notes, and reference IDs. Enforced with compound unique index `{ user: 1, job: 1 }` to prevent duplicate applications at the database level.
- **Profiles Collection (`profiles`)**: Stores 1-to-1 student profile documents with technical skills, academic history, and contact links.

### 2. Secure JWT Authentication & Authorization
- **Stateless JWT**: Standard Bearer token authentication (`Authorization: Bearer <token>`) signed with server-side `JWT_SECRET`.
- **Private Route Protection**: Authentication middleware (`verifyToken`) verifies tokens and attaches authenticated user identity.
- **Data Isolation**: Students can strictly access and modify only their own applications, saved bookmarks, and profile details.
- **User Enumeration Protection**: `GET /api/auth/users` is strictly locked to administrators (`requireAdmin`); unauthorized visitors and students receive `401` / `403`.
- **Role Elevation Guard**: Public registration strictly enforces `role: "student"` and prevents clients from tampering with role fields.

### 3. Role-Based Admin Operations
- **Administrator Capabilities**:
  - Review all candidate submissions across the entire portal on the Dashboard.
  - Update candidate application status (`Pending`, `Accepted`, `Rejected`) via `PATCH /api/applications/:id/status`.
  - Create, edit, and delete job postings via `POST /api/jobs`, `PUT /api/jobs/:id`, and `DELETE /api/jobs/:id`.

### 4. Interactive Frontend (React + Vite)
- Real-time job search by keyword, company, and skills.
- Multi-filter dropdowns for Category, Job Type, and Location.
- Responsive Student & Admin Dashboard views.
- Student Profile with interactive skill tag manager.
- Quick 1-click Demo Logins for Student and Admin roles during college project demonstrations.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM (v6), Bootstrap 5.3, Bootstrap Icons
- **Backend**: Node.js, Express, Mongoose 9, CORS, Dotenv, Bcryptjs, JSON Web Tokens (jsonwebtoken)
- **Database**: MongoDB Community Server 9.0 (Local instance on `127.0.0.1:27017`)
- **Inspection Tool**: MongoDB Compass

---

## 🔑 Pre-Seeded Demo Accounts

The backend automatically seeds these demo accounts on startup (or via `npm run seed`):

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Student Demo** | `student@careerlaunch.edu` | `StudentPassword123!` | Apply to jobs, bookmark roles, manage profile |
| **Admin Demo** | `admin@careerlaunch.edu` | `AdminPassword123!` | View all student submissions, update application status, manage jobs |

*(Quick-login buttons are also available on the Login page for 1-click access during presentations).*

---

## 💻 Quick Start on Windows (PowerShell)

### Prerequisites
- [Node.js LTS](https://nodejs.org/) installed
- MongoDB Community Server running locally on port `27017`

### Step 1: Backend Setup & Execution (Terminal 1)
```powershell
cd backend
npm install
npm run seed     # (Optional: seeds/verifies initial data)
npm run dev
```
The Express API runs at **`http://localhost:5000`** and connects to `mongodb://127.0.0.1:27017/careerlaunch`.

### Step 2: Frontend Setup & Execution (Terminal 2)
```powershell
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## ⚙️ Environment Variables (`backend/.env`)

Configure `backend/.env` with the following keys:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/careerlaunch
JWT_SECRET=your_jwt_secret_key_here
ADMIN_SETUP_KEY=your_admin_secret_key_here
```

---

## 🔍 Verification & API Endpoints

Test the API endpoints directly in PowerShell:

```powershell
# 1. Health check & live database counts
Invoke-RestMethod http://localhost:5000/api/health

# 2. Fetch public job listings from MongoDB
Invoke-RestMethod http://localhost:5000/api/jobs

# 3. Test Student Login (receives JWT token)
$login = @{ email = "student@careerlaunch.edu"; password = "StudentPassword123!" } | ConvertTo-Json
$res = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method POST -Body $login -ContentType "application/json"
$token = $res.token

# 4. Fetch Authenticated Profile from MongoDB
Invoke-RestMethod -Uri http://localhost:5000/api/profile -Headers @{ Authorization = "Bearer $token" }

# 5. Fetch Authenticated Applications from MongoDB
Invoke-RestMethod -Uri http://localhost:5000/api/applications -Headers @{ Authorization = "Bearer $token" }
```

---

## 🧭 Viewing Collections in MongoDB Compass

1. Open **MongoDB Compass**.
2. Connect to the URI: `mongodb://127.0.0.1:27017`.
3. Select the **`careerlaunch`** database in the left panel.
4. You will see five active collections:
   - `users`: Registered users with hashed passwords and assigned roles (`student` / `admin`).
   - `jobs`: 12 indexed jobs with eligibility, requirements, and salaries.
   - `savedjobs`: Bookmarked roles linked by student `user` ObjectId.
   - `applications`: Candidate applications with generated reference IDs and status.
   - `profiles`: Student bios, contact details, and skill tags.

---

## 🎓 College Demonstration Walkthrough

When presenting this project for evaluation or viva:

1. **Student Login**:
   - Go to `/login` and click **"Demo Student Account"**.
   - Show that the student's name, profile, saved jobs, and submitted applications are immediately fetched from MongoDB.
2. **Apply to a Job & Duplicate Prevention**:
   - Navigate to `/jobs`, select an open listing, and submit an application.
   - Show the success confirmation. Attempt to apply again to demonstrate that duplicate submissions are locked by the compound unique index in MongoDB.
3. **Admin Login & Hiring Decision**:
   - Log out and log in using **"Demo Administrator Account"**.
   - Notice the **Admin** badge in the navbar and the **Admin Application Management** banner on `/dashboard`.
   - In the applications table, switch a candidate's status from *Pending* to *Accepted*.
   - Refresh the page (or check MongoDB Compass) to demonstrate that the status change persisted in MongoDB.
4. **Student Profile Update**:
   - Log back into the student account, navigate to `/profile`, add a new skill tag (e.g. *Docker*), and click **Save Changes**.
   - Refresh the page to prove that the update persisted in MongoDB.
