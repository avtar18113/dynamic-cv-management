<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

function sendVerificationEmail($to, $name, $token) {
    $dotenv = parse_ini_file(__DIR__ . '/../.env');

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $dotenv['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $dotenv['SMTP_USER'];
        $mail->Password = $dotenv['SMTP_PASS'];
        $mail->SMTPSecure = 'tls';
        $mail->Port = $dotenv['SMTP_PORT'];

        // Recipients
        $mail->setFrom($dotenv['SMTP_USER'], 'CV Portal');
        $mail->addAddress($to, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Verify your email';
        $url = "http://localhost/cv-portal/backend/api/verify-email?token=$token";
        $mail->Body = "Hi $name,<br><br>Please verify your email by clicking the link below:<br><a href='$url'>Verify Email</a>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}
