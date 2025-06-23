<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/auth.php';
function createUser($pdo) {
    $input = json_decode(file_get_contents("php://input"), true);

    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');
    $role = $input['role'] ?? 'user';
    $email_verified = $input['email_verified'] ?? '1';

    if (!$name || !$email || !$password) {
        json_response(false, "Missing required fields");
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(false, "Email already exists");
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, email_verified) VALUES (?, ?, ?, ?, ?)");
    $success = $stmt->execute([$name, $email, $hashedPassword, $role, $email_verified]);

    if ($success) {
        json_response(true, "User created successfully");
    } else {
        json_response(false, "User creation failed");
    }
}
function listUsers($pdo) {
    require_login();
    if (!is_admin()) {
        json_response(false, "Only admin can view managers");
    }

    $stmt = $pdo->prepare("SELECT id, name,email_verified, email,role FROM users");
    $stmt->execute();
    $managers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(true, "Manager list", $managers);
}

function deleteUser($pdo) {
    require_login();

    $data = json_decode(file_get_contents("php://input"), true);
    if (empty($data['id'])) {
        json_response(false, "Missing User ID");
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    if ($stmt->execute([$data['id']])) {
        json_response(true, "users deleted successfully");
    } else {
        json_response(false, "Failed to delete users");
    }
}