-- PlaceIQ Campus Placement System Database Schema
-- Compatible with SQLite and MySQL / MariaDB

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'student', 'officer', 'company'
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    student_id VARCHAR(50) DEFAULT NULL,
    company_id VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Directory
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    department VARCHAR(100) NOT NULL,
    branch_code VARCHAR(20) NOT NULL,
    cgpa DECIMAL(4, 2) NOT NULL,
    backlogs INT NOT NULL DEFAULT 0,
    passing_year INT NOT NULL DEFAULT 2026,
    skills TEXT NOT NULL, -- JSON array of skills
    status VARCHAR(50) NOT NULL DEFAULT 'Seeking',
    placed_company VARCHAR(150) DEFAULT NULL,
    placed_package VARCHAR(50) DEFAULT NULL,
    resume_url TEXT DEFAULT NULL,
    avatar TEXT DEFAULT NULL,
    linkedin TEXT DEFAULT NULL,
    github TEXT DEFAULT NULL,
    headline TEXT DEFAULT NULL,
    location TEXT DEFAULT NULL,
    projects TEXT DEFAULT NULL, -- JSON array of [{ title, tech, description }]
    certifications TEXT DEFAULT NULL, -- JSON array of [{ title, issuer, details }]
    education_10th TEXT DEFAULT NULL, -- JSON object { title, board, score, details }
    education_12th TEXT DEFAULT NULL, -- JSON object { title, board, score, details }
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Partner Companies
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    website VARCHAR(255) DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,
    hr_contact VARCHAR(150) DEFAULT NULL,
    email VARCHAR(150) NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'Tier 2 (Core)',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    logo TEXT DEFAULT NULL,
    total_hires INT NOT NULL DEFAULT 0,
    avg_package VARCHAR(50) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Campus Recruitment Drives (Jobs)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
    role VARCHAR(100) DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,
    package_ctc DECIMAL(5, 2) NOT NULL, -- LPA
    package_display VARCHAR(50) NOT NULL,
    stipend VARCHAR(100) DEFAULT NULL,
    min_cgpa DECIMAL(4, 2) NOT NULL DEFAULT 6.0,
    allowed_branches TEXT NOT NULL, -- JSON array of branches e.g. ["CSE", "IT"]
    max_backlogs INT NOT NULL DEFAULT 0,
    deadline DATE NOT NULL,
    posted_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    vacancies INT NOT NULL DEFAULT 5,
    rounds TEXT NOT NULL, -- JSON array of recruitment rounds
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Student Applications
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    student_roll VARCHAR(50) NOT NULL,
    student_branch VARCHAR(20) NOT NULL,
    student_cgpa DECIMAL(4, 2) NOT NULL,
    company_id VARCHAR(50) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    applied_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Applied', -- 'Applied', 'Screened', 'Interview', 'Offered', 'Rejected'
    offered_package VARCHAR(50) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    interview_round VARCHAR(150) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Interview Schedules
CREATE TABLE IF NOT EXISTS interviews (
    id VARCHAR(50) PRIMARY KEY,
    job_id VARCHAR(50) DEFAULT NULL,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    student_roll VARCHAR(50) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    round_name VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue_or_link TEXT NOT NULL,
    interviewer VARCHAR(150) DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Cancelled'
    instructions TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Recruiter Registrations & Approvals
CREATE TABLE IF NOT EXISTS recruiters (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    website VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    registered_at VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
