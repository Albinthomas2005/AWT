<?php
/**
 * Students API Endpoint
 * GET: Fetch all students or single by id
 * POST: Enroll new student
 * PUT: Update student record
 * DELETE: Remove student
 */

require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $roll = $_GET['rollNo'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM students WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $s = $stmt->fetch();
        if ($s) {
            echo json_encode(['success' => true, 'data' => formatStudent($s)]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Student not found']);
        }
        exit();
    }

    if ($roll) {
        $stmt = $pdo->prepare("SELECT * FROM students WHERE roll_no = :roll LIMIT 1");
        $stmt->execute([':roll' => $roll]);
        $s = $stmt->fetch();
        if ($s) {
            echo json_encode(['success' => true, 'data' => formatStudent($s)]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Student not found']);
        }
        exit();
    }

    $stmt = $pdo->query("SELECT * FROM students ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    $data = array_map('formatStudent', $rows);

    echo json_encode(['success' => true, 'data' => $data]);
    exit();
}

if ($method === 'POST') {
    $input = getJsonInput();
    $id = $input['id'] ?? ('std-' . round(microtime(true) * 1000));
    $name = $input['name'] ?? 'New Student';
    $rollNo = $input['rollNo'] ?? $input['roll_no'] ?? ('R-' . substr(uniqid(), -4));
    $email = $input['email'] ?? strtolower(str_replace(' ', '.', $name)) . '@campus.edu';
    $phone = $input['phone'] ?? '+91 90000 00000';
    $department = $input['department'] ?? 'Computer Science & Engineering';
    $branchCode = $input['branchCode'] ?? $input['branch_code'] ?? 'CSE';
    $cgpa = (float)($input['cgpa'] ?? 8.0);
    $backlogs = (int)($input['backlogs'] ?? 0);
    $passingYear = (int)($input['passingYear'] ?? $input['passing_year'] ?? 2026);
    $skills = is_array($input['skills'] ?? null) ? json_encode($input['skills']) : json_encode(['Python', 'Web Development']);
    $status = $input['status'] ?? 'Seeking';
    $placedCompany = $input['placedCompany'] ?? null;
    $placedPackage = $input['placedPackage'] ?? null;
    $resumeUrl = $input['resumeUrl'] ?? null;
    $avatar = $input['avatar'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    $linkedin = $input['linkedin'] ?? null;
    $github = $input['github'] ?? null;
    $headline = $input['headline'] ?? null;
    $location = $input['location'] ?? null;
    $projects = isset($input['projects']) ? (is_array($input['projects']) ? json_encode($input['projects']) : $input['projects']) : json_encode([]);
    $certifications = isset($input['certifications']) ? (is_array($input['certifications']) ? json_encode($input['certifications']) : $input['certifications']) : json_encode([]);
    $education10th = isset($input['education10th']) ? (is_array($input['education10th']) ? json_encode($input['education10th']) : $input['education10th']) : null;
    $education12th = isset($input['education12th']) ? (is_array($input['education12th']) ? json_encode($input['education12th']) : $input['education12th']) : null;

    // INSERT IGNORE: if student with same id already exists, skip silently (safe for auto-sync)
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO students (id, name, roll_no, email, phone, department, branch_code, cgpa, backlogs, passing_year, skills, status, placed_company, placed_package, resume_url, avatar, linkedin, github, headline, location, projects, certifications, education_10th, education_12th)
        VALUES (:id, :name, :roll_no, :email, :phone, :department, :branch_code, :cgpa, :backlogs, :passing_year, :skills, :status, :placed_company, :placed_package, :resume_url, :avatar, :linkedin, :github, :headline, :location, :projects, :certifications, :education_10th, :education_12th)
    ");

    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':roll_no' => $rollNo,
        ':email' => $email,
        ':phone' => $phone,
        ':department' => $department,
        ':branch_code' => $branchCode,
        ':cgpa' => $cgpa,
        ':backlogs' => $backlogs,
        ':passing_year' => $passingYear,
        ':skills' => $skills,
        ':status' => $status,
        ':placed_company' => $placedCompany,
        ':placed_package' => $placedPackage,
        ':resume_url' => $resumeUrl,
        ':avatar' => $avatar,
        ':linkedin' => $linkedin,
        ':github' => $github,
        ':headline' => $headline,
        ':location' => $location,
        ':projects' => $projects,
        ':certifications' => $certifications,
        ':education_10th' => $education10th,
        ':education_12th' => $education12th,
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM students WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $created = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => "Student {$name} enrolled into database!",
        'data' => formatStudent($created)
    ]);
    exit();
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $id = $input['id'] ?? ($_GET['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Student ID is required for update']);
        exit();
    }

    $stmtOld = $pdo->prepare("SELECT * FROM students WHERE id = :id");
    $stmtOld->execute([':id' => $id]);
    $current = $stmtOld->fetch();

    if (!$current) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Student not found']);
        exit();
    }

    $name = $input['name'] ?? $current['name'];
    $rollNo = $input['rollNo'] ?? $input['roll_no'] ?? $current['roll_no'];
    $email = $input['email'] ?? $current['email'];
    $phone = $input['phone'] ?? $current['phone'];
    $department = $input['department'] ?? $current['department'];
    $branchCode = $input['branchCode'] ?? $input['branch_code'] ?? $current['branch_code'];
    $cgpa = isset($input['cgpa']) ? (float)$input['cgpa'] : (float)$current['cgpa'];
    $backlogs = isset($input['backlogs']) ? (int)$input['backlogs'] : (int)$current['backlogs'];
    $passingYear = isset($input['passingYear']) ? (int)$input['passingYear'] : (int)$current['passing_year'];
    $skills = isset($input['skills']) ? (is_array($input['skills']) ? json_encode($input['skills']) : $input['skills']) : $current['skills'];
    $status = $input['status'] ?? $current['status'];
    $placedCompany = array_key_exists('placedCompany', $input) ? $input['placedCompany'] : $current['placed_company'];
    $placedPackage = array_key_exists('placedPackage', $input) ? $input['placedPackage'] : $current['placed_package'];
    $resumeUrl = array_key_exists('resumeUrl', $input) ? $input['resumeUrl'] : $current['resume_url'];
    $avatar = $input['avatar'] ?? $current['avatar'];
    $linkedin = array_key_exists('linkedin', $input) ? $input['linkedin'] : $current['linkedin'];
    $github = array_key_exists('github', $input) ? $input['github'] : $current['github'];
    $headline = array_key_exists('headline', $input) ? $input['headline'] : ($current['headline'] ?? null);
    $location = array_key_exists('location', $input) ? $input['location'] : ($current['location'] ?? null);
    $projects = isset($input['projects']) ? (is_array($input['projects']) ? json_encode($input['projects']) : $input['projects']) : ($current['projects'] ?? '[]');
    $certifications = isset($input['certifications']) ? (is_array($input['certifications']) ? json_encode($input['certifications']) : $input['certifications']) : ($current['certifications'] ?? '[]');
    $education10th = isset($input['education10th']) ? (is_array($input['education10th']) ? json_encode($input['education10th']) : $input['education10th']) : ($current['education_10th'] ?? null);
    $education12th = isset($input['education12th']) ? (is_array($input['education12th']) ? json_encode($input['education12th']) : $input['education12th']) : ($current['education_12th'] ?? null);

    $stmt = $pdo->prepare("
        UPDATE students SET
            name = :name,
            roll_no = :roll_no,
            email = :email,
            phone = :phone,
            department = :department,
            branch_code = :branch_code,
            cgpa = :cgpa,
            backlogs = :backlogs,
            passing_year = :passing_year,
            skills = :skills,
            status = :status,
            placed_company = :placed_company,
            placed_package = :placed_package,
            resume_url = :resume_url,
            avatar = :avatar,
            linkedin = :linkedin,
            github = :github,
            headline = :headline,
            location = :location,
            projects = :projects,
            certifications = :certifications,
            education_10th = :education_10th,
            education_12th = :education_12th
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':roll_no' => $rollNo,
        ':email' => $email,
        ':phone' => $phone,
        ':department' => $department,
        ':branch_code' => $branchCode,
        ':cgpa' => $cgpa,
        ':backlogs' => $backlogs,
        ':passing_year' => $passingYear,
        ':skills' => $skills,
        ':status' => $status,
        ':placed_company' => $placedCompany,
        ':placed_package' => $placedPackage,
        ':resume_url' => $resumeUrl,
        ':avatar' => $avatar,
        ':linkedin' => $linkedin,
        ':github' => $github,
        ':headline' => $headline,
        ':location' => $location,
        ':projects' => $projects,
        ':certifications' => $certifications,
        ':education_10th' => $education10th,
        ':education_12th' => $education12th,
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM students WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $updated = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Student profile updated in database',
        'data' => formatStudent($updated)
    ]);
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $input = getJsonInput();
        $id = $input['id'] ?? null;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Student ID is required']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM students WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Student removed from database']);
    exit();
}
