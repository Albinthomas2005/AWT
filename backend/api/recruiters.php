<?php
/**
 * Recruiters API Endpoint
 * Handles Recruiter registrations, approvals, rejections, and directory listing
 */

require_once __DIR__ . '/../config.php';

// Ensure table exists
$pdo->exec("
    CREATE TABLE IF NOT EXISTS recruiters (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        company_name VARCHAR(150) NOT NULL,
        website VARCHAR(255) DEFAULT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        registered_at VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
");

// Check if empty and seed initial default records if needed
$count = $pdo->query("SELECT COUNT(*) FROM recruiters")->fetchColumn();
if ($count == 0) {
    $stmtInit = $pdo->prepare("
        INSERT OR IGNORE INTO recruiters (id, name, email, company_name, website, phone, status, registered_at)
        VALUES (:id, :name, :email, :company_name, :website, :phone, :status, :registered_at)
    ");
    // Compatible with MySQL (INSERT IGNORE) or SQLite (INSERT OR IGNORE)
    try {
        $pdo->exec("
            INSERT IGNORE INTO recruiters (id, name, email, company_name, website, phone, status, registered_at)
            VALUES 
            ('rec-1', 'Google Campus Recruiter', 'recruiter@placement.com', 'Google India', 'https://careers.google.com', '+91 98111 22334', 'Approved', '2026-10-15'),
            ('rec-2', 'Google India Recruitment Lead', 'campus-hiring@google.com', 'Google India', 'https://careers.google.com', '+91 98222 33445', 'Approved', '2026-10-20'),
            ('rec-demo-pending', 'Vikram Mehta', 'hiring@nexustech.io', 'NexusTech Systems', 'https://nexustech.io', '+91 98765 43210', 'Pending', '2026-11-01')
        ");
    } catch (Exception $e) {
        try {
            $pdo->exec("
                INSERT OR IGNORE INTO recruiters (id, name, email, company_name, website, phone, status, registered_at)
                VALUES 
                ('rec-1', 'Google Campus Recruiter', 'recruiter@placement.com', 'Google India', 'https://careers.google.com', '+91 98111 22334', 'Approved', '2026-10-15'),
                ('rec-2', 'Google India Recruitment Lead', 'campus-hiring@google.com', 'Google India', 'https://careers.google.com', '+91 98222 33445', 'Approved', '2026-10-20'),
                ('rec-demo-pending', 'Vikram Mehta', 'hiring@nexustech.io', 'NexusTech Systems', 'https://nexustech.io', '+91 98765 43210', 'Pending', '2026-11-01')
            ");
        } catch (Exception $e2) {
            // Ignore seeding errors
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM recruiters ORDER BY created_at DESC");
    $rows = $stmt->fetchAll();
    $data = array_map('formatRecruiter', $rows);
    echo json_encode(['success' => true, 'data' => $data]);
    exit();
}

if ($method === 'POST') {
    $input = getJsonInput();
    $id = $input['id'] ?? ('rec-' . round(microtime(true) * 1000));
    $name = trim($input['name'] ?? $input['recruiterName'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $companyName = trim($input['companyName'] ?? $input['company_name'] ?? '');
    $website = trim($input['website'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $status = $input['status'] ?? 'Pending';
    $registeredAt = $input['registeredAt'] ?? date('Y-m-d');
    $password = $input['password'] ?? 'Recruiter@123';

    if (!$email || !$companyName) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and Company Name are required']);
        exit();
    }

    // Check if email already exists
    $chk = $pdo->prepare("SELECT id FROM recruiters WHERE LOWER(email) = :email LIMIT 1");
    $chk->execute([':email' => $email]);
    if ($chk->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Recruiter email '{$email}' already exists"]);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO recruiters (id, name, email, company_name, website, phone, status, registered_at)
        VALUES (:id, :name, :email, :company_name, :website, :phone, :status, :registered_at)
    ");
    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':email' => $email,
        ':company_name' => $companyName,
        ':website' => $website,
        ':phone' => $phone,
        ':status' => $status,
        ':registered_at' => $registeredAt
    ]);

    // Also register user credentials in users table
    try {
        $userId = 'usr-' . round(microtime(true) * 1000);
        $stmtUser = $pdo->prepare("
            INSERT INTO users (id, username, password, role, name, email, company_id)
            VALUES (:id, :username, :password, 'company', :name, :email, :company_id)
        ");
        $stmtUser->execute([
            ':id' => $userId,
            ':username' => $email,
            ':password' => $password,
            ':name' => $name,
            ':email' => $email,
            ':company_id' => 'cmp-' . round(microtime(true) * 1000)
        ]);
    } catch (Exception $e) {
        // User record may already exist
    }

    $stmtGet = $pdo->prepare("SELECT * FROM recruiters WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $created = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => "Recruiter registered successfully! Status: {$status}",
        'data' => formatRecruiter($created)
    ]);
    exit();
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $id = $input['id'] ?? ($_GET['id'] ?? null);
    $status = $input['status'] ?? 'Approved';

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Recruiter ID is required']);
        exit();
    }

    $stmt = $pdo->prepare("UPDATE recruiters SET status = :status WHERE id = :id OR email = :id");
    $stmt->execute([':status' => $status, ':id' => $id]);

    $stmtGet = $pdo->prepare("SELECT * FROM recruiters WHERE id = :id OR email = :id LIMIT 1");
    $stmtGet->execute([':id' => $id]);
    $updated = $stmtGet->fetch();

    if (!$updated) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Recruiter not found']);
        exit();
    }

    // If status is Approved, ensure company is active in companies table
    if ($status === 'Approved' && !empty($updated['company_name'])) {
        $chkCmp = $pdo->prepare("SELECT id FROM companies WHERE LOWER(name) = :name LIMIT 1");
        $chkCmp->execute([':name' => strtolower($updated['company_name'])]);
        if (!$chkCmp->fetch()) {
            $cmpId = 'cmp-' . round(microtime(true) * 1000);
            $stmtCmp = $pdo->prepare("
                INSERT INTO companies (id, name, industry, website, location, hr_contact, email, tier, status, logo, total_hires, avg_package, description)
                VALUES (:id, :name, 'Technology & Services', :website, 'Bengaluru / Pan India', :hr_contact, :email, 'Tier 1 (Dream)', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 0, '12.0 LPA', :description)
            ");
            $stmtCmp->execute([
                ':id' => $cmpId,
                ':name' => $updated['company_name'],
                ':website' => $updated['website'] ?: 'https://example.com',
                ':hr_contact' => $updated['name'] ?: 'Campus Relations Lead',
                ':email' => $updated['email'],
                ':description' => "{$updated['company_name']} is an accredited recruitment partner."
            ]);
        }
    }

    echo json_encode([
        'success' => true,
        'message' => "Recruiter status updated to {$status}",
        'data' => formatRecruiter($updated)
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
        echo json_encode(['success' => false, 'message' => 'Recruiter ID is required']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM recruiters WHERE id = :id OR email = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Recruiter removed successfully']);
    exit();
}

echo json_encode(['status' => 'Recruiters API ready']);
