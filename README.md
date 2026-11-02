# PlaceIQ - Centralized Campus Placement & Recruitment Management System

A full-stack, enterprise-grade Campus Placement and Recruitment automation platform built with **React (Frontend)**, **PHP REST API (Backend)**, and **SQL Database (SQLite / MySQL)**.

---

## Architecture Overview

```
Frontend (React + Vite)  <─── /api/ proxy ───>  Backend (PHP REST API)  <─── PDO ───>  Database (placeiq.db / MySQL)
   localhost:5173                                   localhost:8000                           backend/db/
```

- **Frontend:** React 19, Tailwind CSS, Lucide Icons, Canvas Confetti, Recharts.
- **Backend:** Modular PHP 8.5 REST API running on PHP built-in server or Apache/Nginx.
- **Database:** Relational SQL database managed via PDO (SQLite default zero-config, with full MySQL support).

---

## Database Schema (`backend/db/schema.sql`)

The database consists of 6 primary tables:
1. `users` — Authentication credentials for Student 1 (`1`/`1`), Student 2 (`2`/`2`), Student 3 (`3`/`3`), Placement Admin, and Company Recruiters.
2. `students` — Candidate academic profiles, CGPA, branch, backlogs, skills, and placement status.
3. `companies` — Partner hiring firms, tiers, industry, and HR contacts.
4. `jobs` — Campus recruitment drives, eligibility cutoffs, CTC, deadlines, and interview rounds.
5. `applications` — Student drive applications, screening progress, and formal offer letters.
6. `interviews` — Live interview schedule slots, venues, and status.

---

## PHP REST API Endpoints (`backend/api/`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth.php` | Authenticate against database credentials |
| `GET / POST / PUT / DELETE` | `/api/students.php` | Full CRUD for candidate profiles |
| `GET / POST / PUT / DELETE` | `/api/companies.php` | Full CRUD for partner companies |
| `GET / POST / PUT / DELETE` | `/api/jobs.php` | Full CRUD for campus drives |
| `GET / POST / PUT` | `/api/applications.php` | Submit applications and update hiring statuses |
| `GET / POST / PUT` | `/api/interviews.php` | Schedule and update interview rounds |
| `POST` | `/api/reset.php` | Re-seed database to clean baseline directory |

---

## How to Run Locally

### 1. Start the PHP Backend Server (Port 8000)
```bash
npm run dev:backend
# Or manually:
php -S 0.0.0.0:8000 -t backend
```

### 2. Start the React Frontend (Port 5173)
```bash
npm run dev
```

### 3. (Optional) Using XAMPP / MySQL
1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Open your browser at [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
3. Click the **Import** tab.
4. Choose [`placeiq.sql`](file:///home/albin-thomas/Music/project/placeiq.sql) and click **Go** (it creates the database `placeiq` and seeds all tables automatically).
5. The backend will automatically detect and connect to your local XAMPP MySQL instance!

### 4. (Optional) Re-seed the Database
```bash
npm run db:seed
```

---

## Pre-Configured Demo Accounts

- **Student 1:** Username `1` / Password `1` (CSE • 9.40 CGPA • Google Offer)
- **Student 2:** Username `2` / Password `2` (ECE • 7.15 CGPA • Cisco Interview)
- **Student 3:** Username `3` / Password `3` (CSE • 9.35 CGPA • Microsoft Placed)
- **Placement Directorate Admin:** `admin@placement.edu` (Password: `admin123`)
- **Corporate Recruiter:** `campus-hiring@google.com` (Password: `hiring123`)
