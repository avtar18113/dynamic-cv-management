<?php
function is_logged_in() {
    return isset($_SESSION['user']);
}

function require_login() {
    if (!is_logged_in()) {
        http_response_code(401);
        json_response(false, "Unauthorized");
    }
}

function is_admin() {
    return is_logged_in() && $_SESSION['user']['role'] === 'admin';
}
