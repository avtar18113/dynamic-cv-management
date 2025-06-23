<?php
// ✅ CORS HEADERS (must be first)
header("Access-Control-Allow-Origin: http://localhost:5173"); // your frontend origin
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ PRE-FLIGHT CHECK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/helpers.php';

$uri = str_replace('/cv-portal/backend', '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$method = $_SERVER['REQUEST_METHOD'];

// ✅ AUTH ROUTES
if ($uri === '/api/register' && $method === 'POST') {
    require 'controllers/AuthController.php';
    register($pdo);
}
elseif ($uri === '/api/login' && $method === 'POST') {
    require 'controllers/AuthController.php';
    login($pdo);
}
elseif ($uri === '/api/logout' && $method === 'POST') {
    require 'controllers/AuthController.php';
    logout();
}

// ✅ PROJECTS
elseif ($uri === '/api/project/create' && $method === 'POST') {
    require 'controllers/ProjectController.php';
    createProject($pdo);
}
elseif ($uri === '/api/project/list' && $method === 'GET') {
    require 'controllers/ProjectController.php';
    listProjects($pdo);
}
elseif ($uri === '/api/project/assign-manager' && $method === 'POST') {
    require 'controllers/ProjectController.php';
    assignManagerToProject($pdo);
}
elseif ($uri === '/api/project/assigned-managers' && $method === 'GET') {
    require 'controllers/ProjectController.php';
    getAssignedManagers($pdo);
}

// ✅ MANAGERS
elseif ($uri === '/api/manager/create' && $method === 'POST') {
    require 'controllers/ManagerController.php';
    createManager($pdo);
}
elseif ($uri === '/api/manager/list' && $method === 'GET') {
    require 'controllers/ManagerController.php';
    listManagers($pdo);
}
elseif ($uri === '/api/user/create' && $method === 'POST') {
    require 'controllers/UserController.php';
    createUser($pdo);
}

elseif ($uri === '/api/user/list' && $method === 'GET') {
    require 'controllers/UserController.php';
    listUsers($pdo);
}
elseif ($uri === '/api/user/delete' && $method === 'POST') {
    require 'controllers/UserController.php';
    deleteUser($pdo);
}
elseif ($uri === '/api/manager/projects' && $method === 'GET') {
    require 'controllers/ProjectController.php';
    getProjectsForManager($pdo);
}

// ✅ CV FIELDS
elseif ($uri === '/api/cv/field/add' && $method === 'POST') {
    require 'controllers/CVController.php';
    addCVField($pdo);
}


elseif (strpos($uri, '/api/cv/field/list') === 0 && $method === 'GET') {
    require 'controllers/CVController.php';
    getCVFieldsByProject($pdo);
}

// ✅ CV SUBMISSION + EXPORTS
elseif ($uri === '/api/cv/submit' && $method === 'POST') {
    require 'controllers/CVController.php';
    submitCV($pdo);
}
elseif (strpos($uri, '/api/cv/download/pdf') === 0 && $method === 'GET') {
    require 'controllers/CVController.php';
    downloadCVAsPDF($pdo);
}
elseif (strpos($uri, '/api/admincv/download/pdf') === 0 && $method === 'GET') {
    require 'controllers/CVController.php';
    downloadbyManagerCVAsPDF($pdo);
}
elseif (strpos($uri, '/api/cv/download/ppt') === 0 && $method === 'GET') {
    require 'controllers/CVController.php';
    downloadCVAsPPT($pdo);
}
elseif ($uri === '/api/cv/list' && $method === 'GET') {
    require 'controllers/CVController.php';
    getAllCVs($pdo);
}
elseif ($uri === '/api/cv/export/csv' && $method === 'GET') {
    require 'controllers/CVController.php';
    exportCVsAsCSV($pdo);
}
elseif (strpos($uri, '/api/cv/export/zip/pdf') === 0 && $method === 'GET') {
    require 'controllers/CVController.php';
    exportCVsAsPDFZip($pdo);
}

// ✅ EMAIL VERIFY
elseif (strpos($uri, '/api/verify-email') === 0 && $method === 'GET') {
    require 'controllers/AuthController.php';
    verifyEmail($pdo);
}
elseif ($uri === '/api/project/public-list' && $method === 'GET') {
    require 'controllers/ProjectController.php';
    getPublicProjects($pdo);
}
elseif ($uri === '/api/project/delete' && $method === 'POST') {
    require 'controllers/ProjectController.php';
    deleteProject($pdo);
}

elseif ($uri === '/api/project/update' && $method === 'POST') {
    require 'controllers/ProjectController.php';
    updateProject($pdo);
}
else {
    http_response_code(404);
    json_response(false, "Route not found: $uri");
}
