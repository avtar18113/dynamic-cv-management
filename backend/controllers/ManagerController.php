<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/auth.php';

function createManager($pdo) {
    // require_login();
    // if (!is_admin()) {
    //     json_response(false, "Only admin can create managers");
    // }

    $data = json_decode(file_get_contents("php://input"), true);
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        json_response(false, "All fields are required");
    }

    $userModel = new User($pdo);

    if ($userModel->findByEmail($data['email'])) {
        json_response(false, "Email already exists");
    }

    $success = $userModel->create($data['name'], $data['email'], $data['password'], 'manager');

    if ($success) {
        json_response(true, "Manager created successfully");
    } else {
        json_response(false, "Failed to create manager");
    }
}

function listManagers($pdo) {
    // require_login();
    // if (!is_admin()) {
    //     json_response(false, "Only admin can view managers");
    // }

    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE role = 'manager'");
    $stmt->execute();
    $managers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(true, "Manager list", $managers);
}
