<?php
require_once __DIR__ . '/../models/User.php';

function register($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);
    $userModel = new User($pdo);

    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        json_response(false, "All fields are required");
    }

    if ($userModel->findByEmail($data['email'])) {
        json_response(false, "Email already exists");
    }

    $token = bin2hex(random_bytes(20)); // 40-char token

    $hash = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, verify_token) VALUES (?, ?, ?, ?, ?)");
    $created = $stmt->execute([$data['name'], $data['email'], $hash, 'user', $token]);

    if ($created) {
        require_once __DIR__ . '/../utils/mailer.php';
        sendVerificationEmail($data['email'], $data['name'], $token);
        json_response(true, "Registered successfully. Please check your email to verify.");
    } else {
        json_response(false, "Registration failed");
    }
}


function login($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);
    $userModel = new User($pdo);

    $user = $userModel->findByEmail($data['email']);
    if (!$user || !password_verify($data['password'], $user['password'])) {
        json_response(false, "Invalid email or password");
    }

    unset($user['password']);
    $_SESSION['user'] = $user;

    json_response(true, "Login successful", $user);
}
function verifyEmail($pdo) {
    $token = $_GET['token'] ?? '';
    if (!$token) {
        echo "Invalid or missing token.";
        return;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE verify_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo "Invalid or expired token.";
        return;
    }

    $update = $pdo->prepare("UPDATE users SET email_verified = 1, verify_token = NULL WHERE id = ?");
    $update->execute([$user['id']]);

    echo "Email verified successfully. You may now log in and submit CVs.";
}

function logout() {
    session_destroy();
    json_response(true, "Logged out successfully");
}
