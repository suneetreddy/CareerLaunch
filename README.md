# CareerLaunch - Internship and Job Portal

A student-friendly internship and job portal built as a college mini-project.

## Phase 1 features

- React + Vite frontend with React Router navigation
- Responsive navbar, home page (hero, search, stats, benefits, featured jobs, footer)
- Find Jobs page with search, job type filter and location filter
- Job details page, Login page UI, Sign Up page UI, friendly 404 page
- Reusable `JobCard` component
- Bootstrap + a small custom CSS file (navy / indigo / white theme)
- Minimal Express backend with a health check route (`GET /api/health`)

> **Note:** In Phase 1 the demo job data is stored locally in `frontend/src/data/jobs.js`.
> The frontend works even if the backend is not running. No database is needed.

## Requirements

- [Node.js LTS](https://nodejs.org) (includes npm)
- [Visual Studio Code](https://code.visualstudio.com)

## Run on Windows (PowerShell)

Open the `CareerLaunch` folder in VS Code, then open **two** terminals (Terminal > New Terminal).

**Terminal 1 - Frontend**

```powershell
cd frontend
npm install
npm run dev
```

Open the link shown (usually http://localhost:5173).

**Terminal 2 - Backend (optional in Phase 1)**

```powershell
cd backend
npm install
npm run dev
```

If PowerShell says scripts are disabled, run this once and try again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Check the backend health endpoint

With the backend running, open http://localhost:5000/api/health in your browser, or run:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Expected result:

```json
{ "status": "ok", "message": "CareerLaunch API is running" }
```

Optional: copy `backend/.env.example` to `backend/.env` to change the port. Never commit real secrets.

## Folder structure

```
CareerLaunch/
  README.md
  .gitignore
  frontend/   React + Vite app (src/pages, src/components, src/data)
  backend/    Express server (server.js)
```

## Next phases

- **Phase 2:** authentication and database (real sign up and login)
- **Phase 3:** job applications and saved jobs
- **Phase 4:** dashboard and admin features

Keep this same folder - later phases will update this project, not create a new one.
