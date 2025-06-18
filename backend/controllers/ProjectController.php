<?php
require_once __DIR__ . '/../models/Project.php';
require_once __DIR__ . '/../utils/auth.php';

function getPublicProjects($pdo) {
    $stmt = $pdo->prepare("SELECT id, name, slug, logo_url, start_date, end_date FROM projects WHERE is_active = 1 ORDER BY start_date DESC");
    $stmt->execute();
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    json_response(true, "Active projects", $projects);
}

function deleteProject($pdo) {
    require_login();

    $data = json_decode(file_get_contents("php://input"), true);
    if (empty($data['id'])) {
        json_response(false, "Missing project ID");
    }

    $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
    if ($stmt->execute([$data['id']])) {
        json_response(true, "Project deleted successfully");
    } else {
        json_response(false, "Failed to delete project");
    }
}

function createProject($pdo) {
    require_login();
    if (!is_admin()) {
        json_response(false, "Only admin can create projects");
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['name']) || empty($data['slug']) || empty($data['start_date']) || empty($data['end_date'])) {
        json_response(false, "Missing required fields");
    }

    $data['created_by'] = $_SESSION['user']['id'];
    $projectModel = new Project($pdo);

    $success = $projectModel->create($data);
    if ($success) {
        json_response(true, "Project created successfully");
    } else {
        json_response(false, "Failed to create project (slug may already exist)");
    }
}
function updateProject($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id'])) {
        json_response(false, 'Missing id fields');
    }
    if (empty($data['name'])) {
        json_response(false, 'Missing name fields');
    }
    if (empty($data['slug'])) {
        json_response(false, 'Missing slug fields');
    }
    // if (empty($data['id']) || empty($data['name']) || empty($data['slug'])) {
    //     json_response(false, 'Missing required fields');
    // }

    $stmt = $pdo->prepare("UPDATE projects SET 
        name = :name,
        slug = :slug,
        logo_url = :logo_url,
        header_image = :header_image,
        start_date = :start_date,
        end_date = :end_date,
        updated_at = NOW()
        WHERE id = :id
    ");

    $success = $stmt->execute([
        ':id' => $data['id'],
        ':name' => $data['name'],
        ':slug' => $data['slug'],
        ':logo_url' => $data['logo_url'] ?? '',
        ':header_image' => $data['header_image'] ?? '',
        ':start_date' => $data['start_date'] ?? null,
        ':end_date' => $data['end_date'] ?? null
    ]);

    if ($success) {
        json_response(true, 'Project updated successfully');
    } else {
        json_response(false, 'Update failed');
    }
}

function listProjects($pdo) {
    // require_login();
    // if (!is_admin()) {
    //     json_response(false, "Only admin can view all projects");
    // }

    $projectModel = new Project($pdo);
    $projects = $projectModel->getAll();

    json_response(true, "Project list", $projects);
}
function assignManagerToProject($pdo) {
    // require_login();
    // if (!is_admin()) {
    //     json_response(false, "Only admin can assign managers");
    // }

    $data = json_decode(file_get_contents("php://input"), true);
    if (empty($data['project_id']) || empty($data['manager_id'])) {
        json_response(false, "Missing project_id or manager_id");
    }

    $stmt = $pdo->prepare("INSERT IGNORE INTO project_managers (project_id, manager_id) VALUES (?, ?)");
    $success = $stmt->execute([$data['project_id'], $data['manager_id']]);

    if ($success) {
        json_response(true, "Manager assigned to project");
    } else {
        json_response(false, "Failed to assign manager");
    }
}

function getProjectsForManager($pdo) {
    // require_login();
    // if ($_SESSION['user']['role'] !== 'manager') {
    //     json_response(false, "Only managers can access this");
    // }

    // $managerId = $_SESSION['user']['id'];
    $managerId=3;
    $stmt = $pdo->prepare("
        SELECT p.* FROM projects p
        JOIN project_managers pm ON pm.project_id = p.id
        WHERE pm.manager_id = ?
        ORDER BY p.id DESC
    ");
    $stmt->execute([$managerId]);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(true, "Assigned projects", $projects);
}

function getAssignedManagers($pdo) {
    // require_login();
    // if (!is_admin()) {
    //     json_response(false, "Only admin can view this");
    // }

    $stmt = $pdo->query("
        SELECT pm.project_id, p.name as project_name, u.id as manager_id, u.name as manager_name, u.email
        FROM project_managers pm
        JOIN projects p ON p.id = pm.project_id
        JOIN users u ON u.id = pm.manager_id
        ORDER BY pm.project_id ASC
    ");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(true, "Project-manager assignments", $results);
}


