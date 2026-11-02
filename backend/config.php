<?php
/**
 * PlaceIQ Database Configuration & Connection (PDO)
 * Supports SQLite (default, zero-setup) and MySQL / MariaDB
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Respond to preflight OPTIONS requests immediately
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
// Priority:
// 1. DB_TYPE env var ('mysql' or 'sqlite') if explicitly specified
// 2. Local MySQL on 127.0.0.1:3306 (default XAMPP / MariaDB configuration)
// 3. Fallback to zero-config SQLite (backend/db/placeiq.db)
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: 'placeiq';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';
$sqlitePath = __DIR__ . '/db/placeiq.db';

$forcedType = getenv('DB_TYPE');
$dbType = $forcedType ?: 'mysql';
$pdo = null;

if ($dbType === 'mysql') {
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 2,
        ]);
        header('X-Database-Engine: MySQL (XAMPP)');
    } catch (PDOException $e) {
        // If MySQL was not explicitly forced, gracefully fall back to SQLite
        if (!$forcedType) {
            $dbType = 'sqlite';
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'MySQL connection failed: ' . $e->getMessage()
            ]);
            exit();
        }
    }
}

if ($dbType === 'sqlite' && !$pdo) {
    if (!is_dir(__DIR__ . '/db')) {
        mkdir(__DIR__ . '/db', 0777, true);
    }
    try {
        $dsn = "sqlite:" . $sqlitePath;
        $pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $pdo->exec('PRAGMA foreign_keys = ON;');
        $pdo->exec('PRAGMA journal_mode = WAL;');
        header('X-Database-Engine: SQLite');
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed: ' . $e->getMessage()
        ]);
        exit();
    }
}

/**
 * Helper to get JSON request body
 */
function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Format Student row to camelCase
 */
function formatStudent($s) {
    if (!$s) return null;
    return [
        'id' => $s['id'],
        'name' => $s['name'],
        'rollNo' => $s['roll_no'],
        'email' => $s['email'],
        'phone' => $s['phone'],
        'department' => $s['department'],
        'branchCode' => $s['branch_code'],
        'cgpa' => (float)$s['cgpa'],
        'backlogs' => (int)$s['backlogs'],
        'passingYear' => (int)$s['passing_year'],
        'skills' => json_decode($s['skills'] ?? '[]', true) ?: [],
        'status' => $s['status'],
        'placedCompany' => $s['placed_company'],
        'placedPackage' => $s['placed_package'],
        'resumeUrl' => $s['resume_url'],
        'avatar' => $s['avatar'],
        'linkedin' => $s['linkedin'],
        'github' => $s['github'],
        'headline' => $s['headline'] ?? null,
        'location' => $s['location'] ?? null,
        'projects' => json_decode($s['projects'] ?? '[]', true) ?: [],
        'certifications' => json_decode($s['certifications'] ?? '[]', true) ?: [],
        'education10th' => json_decode($s['education_10th'] ?? 'null', true),
        'education12th' => json_decode($s['education_12th'] ?? 'null', true)
    ];
}

/**
 * Format Company row to camelCase
 */
function formatCompany($c) {
    if (!$c) return null;
    return [
        'id' => $c['id'],
        'name' => $c['name'],
        'industry' => $c['industry'],
        'website' => $c['website'],
        'location' => $c['location'],
        'hrContact' => $c['hr_contact'],
        'email' => $c['email'],
        'tier' => $c['tier'],
        'status' => $c['status'],
        'logo' => $c['logo'],
        'totalHires' => (int)$c['total_hires'],
        'avgPackage' => $c['avg_package'],
        'description' => $c['description']
    ];
}

/**
 * Format Job row to camelCase
 */
function formatJob($j) {
    if (!$j) return null;
    return [
        'id' => $j['id'],
        'companyId' => $j['company_id'],
        'companyName' => $j['company_name'],
        'title' => $j['title'],
        'type' => $j['type'],
        'role' => $j['role'],
        'location' => $j['location'],
        'packageCtc' => (float)$j['package_ctc'],
        'packageDisplay' => $j['package_display'],
        'stipend' => $j['stipend'],
        'minCgpa' => (float)$j['min_cgpa'],
        'allowedBranches' => json_decode($j['allowed_branches'] ?? '[]', true) ?: [],
        'maxBacklogs' => (int)$j['max_backlogs'],
        'deadline' => $j['deadline'],
        'postedDate' => $j['posted_date'],
        'status' => $j['status'],
        'vacancies' => (int)$j['vacancies'],
        'rounds' => json_decode($j['rounds'] ?? '[]', true) ?: [],
        'description' => $j['description']
    ];
}

/**
 * Format Application row to camelCase
 */
function formatApplication($a) {
    if (!$a) return null;
    return [
        'id' => $a['id'],
        'jobId' => $a['job_id'],
        'studentId' => $a['student_id'],
        'studentName' => $a['student_name'],
        'studentRoll' => $a['student_roll'],
        'studentBranch' => $a['student_branch'],
        'studentCgpa' => (float)$a['student_cgpa'],
        'companyId' => $a['company_id'],
        'companyName' => $a['company_name'],
        'jobTitle' => $a['job_title'],
        'appliedDate' => $a['applied_date'],
        'status' => $a['status'],
        'offeredPackage' => $a['offered_package'],
        'notes' => $a['notes'],
        'interviewRound' => $a['interview_round']
    ];
}

/**
 * Format Interview row to camelCase
 */
function formatInterview($i) {
    if (!$i) return null;
    return [
        'id' => $i['id'],
        'jobId' => $i['job_id'],
        'studentId' => $i['student_id'],
        'studentName' => $i['student_name'],
        'studentRoll' => $i['student_roll'],
        'companyName' => $i['company_name'],
        'roundName' => $i['round_name'],
        'date' => $i['date'],
        'time' => $i['time'],
        'venueOrLink' => $i['venue_or_link'],
        'interviewer' => $i['interviewer'],
        'status' => $i['status'],
        'instructions' => $i['instructions']
    ];
}

/**
 * Format Recruiter row to camelCase
 */
function formatRecruiter($r) {
    if (!$r) return null;
    return [
        'id' => $r['id'],
        'name' => $r['name'],
        'email' => $r['email'],
        'companyName' => $r['company_name'],
        'website' => $r['website'] ?? '',
        'phone' => $r['phone'] ?? '',
        'status' => $r['status'] ?? 'Pending',
        'registeredAt' => $r['registered_at'] ?? explode(' ', $r['created_at'] ?? date('Y-m-d'))[0]
    ];
}
