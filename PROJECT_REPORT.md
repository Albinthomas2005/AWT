# PlaceIQ Project Report

**Review date:** 2 November 2026  
**Project location:** `project/`

## Overview

PlaceIQ is a web application for managing campus recruitment and student placement workflows. It provides separate student, placement officer, and company recruiter views. Students can review placement drives and application progress; officers can manage student and company records, recruitment jobs, and hiring activity; recruiters can review candidates and applications. The data model also supports interview scheduling and offer information.

## Technology and structure

- **Frontend:** React 19, React Router, and Vite, with Tailwind CSS, Lucide icons, Recharts, and Canvas Confetti.
- **Backend:** PHP REST endpoints using PDO.
- **Database:** SQLite by default, with MySQL/MariaDB configuration support.
- **Local development:** Vite serves the frontend on port 5173 and proxies `/api` requests to the PHP server on port 8000.

Key directories:

- `src/pages/` contains the home, login, jobs, results, and role dashboard screens.
- `src/components/` contains navigation, status badges, and workflow modals.
- `src/context/PlacementContext.jsx` manages shared data, authentication state, theme, and API calls.
- `backend/api/` contains endpoints for authentication, students, companies, jobs, applications, interviews, and database reset.
- `backend/db/schema.sql` defines the relational schema; `backend/seed.php` seeds demo data.

## Implemented capabilities observed in the source

- Role-specific routes for students, officers, and company recruiters.
- Student profiles with academic eligibility fields, skills, resume/social links, and placement status.
- Company directory and job-drive records with CTC, branches, CGPA cutoff, backlog limits, deadlines, vacancies, and interview rounds.
- Application submission and status updates, including offer-related fields.
- Interview scheduling and status tracking.
- Eligibility evaluation based on CGPA, branch, and backlog count.
- Shared client-side theme and session state stored in browser `localStorage`.
- API CRUD operations for core entities, with database seed/reset functionality.

## Data snapshot

The checked-in SQLite database contains six tables: `users`, `students`, `companies`, `jobs`, `applications`, and `interviews`. At review time it held 5 user records, 6 student records, 6 company records, 6 job records, 6 application records, and 4 interview records. These are only counts; this report does not reproduce personal records or credentials.

## Security and readiness findings

The current authentication implementation is suitable only as a demo and should be addressed before exposing the application to real users or untrusted networks:

1. **Officer and company login branches accept a role/identifier match without validating the submitted password.** This is directly visible in `backend/api/auth.php`.
2. **Student demo credentials are hard-coded in the authentication flow, and some error messages disclose the expected password.** Replace this with stored password hashes and generic failure messages.
3. **The frontend saves its login state in `localStorage`, while the inspected API endpoints do not establish a server-validated session or token.** A client-side role guard is not an authorization boundary.
4. **The API configuration allows requests from any origin (`Access-Control-Allow-Origin: *`).** Restrict origins for a deployed environment.
5. **API data and mutation endpoints should enforce authentication and role-based authorization on the server.** Otherwise callers can bypass the UI routes and call endpoints directly.

Recommended priority: implement server-side authentication and authorization first, then hash credentials, remove demo shortcuts and password disclosure, and scope CORS. Review reset and destructive CRUD routes under the same authorization policy.

## Current assessment

The repository has a coherent full-stack prototype with a defined schema, seed data, role-oriented screens, and API-backed workflows. It is not ready for production use based on the authentication and authorization behavior inspected above. This report is a source and local database inventory; it does not claim that the application was launched, tested end to end, or security-audited beyond the specific findings listed.

## Files referenced

- `README.md` — project description and run instructions.
- `src/App.jsx` and `src/context/PlacementContext.jsx` — routing, client-side guards, client state, and API calls.
- `backend/api/auth.php` — login behavior.
- `backend/config.php` — database selection and CORS headers.
- `backend/db/schema.sql` — data model.
- `package.json` and `vite.config.js` — scripts, dependencies, and development proxy.
