<?php
require_once __DIR__ . '/../models/CVField.php';
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../models/CVSubmission.php';
require_once __DIR__ . '/../vendor/autoload.php';


use PhpOffice\PhpPresentation\PhpPresentation;
    use PhpOffice\PhpPresentation\IOFactory;
    use PhpOffice\PhpPresentation\Style\Alignment;
    use PhpOffice\PhpPresentation\Style\Color;
    use PhpOffice\PhpPresentation\Style\Fill;

function addCVField($pdo) {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['project_id'])) {
        json_response(false, 'Invalid input: project_id missing.');
        return;
    }
    if (!is_array($input['fields'])) {
        json_response(false, 'Invalid input:  fields missing.');
        return;
    }

    $project_id = $input['project_id'];
    $fields = $input['fields'];

    try {
        $pdo->beginTransaction();

        // Optional: Delete existing fields for that project (if overwriting)
        $stmtDelete = $pdo->prepare("DELETE FROM cv_fields WHERE project_id = ?");
        $stmtDelete->execute([$project_id]);

        // Prepare insert statement
        $stmt = $pdo->prepare("
            INSERT INTO cv_fields 
            (project_id, field_name, field_type, is_required, min_length, max_length, `order`,`options`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($fields as $field) {
            $stmt->execute([
                $project_id,
                $field['field_name'],
                $field['field_type'],
                $field['is_required'] ? 1 : 0,
                $field['min_length'],
                $field['max_length'],
                $field['order'],
                $field['options']
                
            ]);
        }

        $pdo->commit();
        json_response(true, 'CV fields saved successfully.');
    } catch (Exception $e) {
        $pdo->rollBack();
        json_response(false, 'Failed to save fields: ' . $e->getMessage());
    }
}


function getCVFieldsByProject($pdo)
{
    $projectId = $_GET['project_id'] ?? null;

    if (!$projectId) {
        json_response(false, "Missing project_id");
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM cv_fields WHERE project_id = ? ORDER BY `order` ASC");
        $stmt->execute([$projectId]);
        $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Convert options from comma string to array for dropdowns
        foreach ($fields as &$field) {
            if ($field['field_type'] === 'dropdown' && !empty($field['options'])) {
                $field['options'] = array_map('trim', explode(',', $field['options']));
            } else {
                $field['options'] = []; // Ensure consistent structure
            }
        }

        json_response(true, "Fields loaded", $fields);
    } catch (Exception $e) {
        json_response(false, "Failed to fetch fields: " . $e->getMessage());
    }
}




function submitCV($pdo) {
    // require_login();

    // if ($_SESSION['user']['role'] !== 'user') {
    //     json_response(false, "Only users can submit CVs");
    // }

    // if (!$_SESSION['user']['email_verified']) {
    //     json_response(false, "Email not verified");
    // }

    $data = json_decode(file_get_contents("php://input"), true);

    // if (empty($data['project_id'])) {
    //     json_response(false, "Missing project_id");
    // }
    // elseif (empty($data['data'])) {
    //     json_response(false, "Empty data");
    // }
    // elseif ( !is_array($data['data'])) {
    //     json_response(false, "Array  data Issue");
    // }

    if (empty($_POST['project_id'])) {
        json_response(false, "Missing project_id");
    }

    if (empty($_POST['form_data'])) {
        json_response(false, "Empty form data");
    }

    $project_id = intval($_POST['project_id']);
    $form_data_json = $_POST['form_data'];
    $form_data = json_decode($form_data_json, true);

     if (!is_array($form_data)) {
        json_response(false, "Invalid form data format");
    }

    // $user_id = $_SESSION['user']['id'];
$user_id=6;
    $cvModel = new CVSubmission($pdo);

    if ($cvModel->hasSubmitted($project_id, $user_id)) {
        json_response(false, "You have already submitted a CV for this project");
    }

     // Optionally handle file upload
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $allowed_types = ['image/jpeg', 'image/jpg'];
    $max_size = 2 * 1024 * 1024; // 10MB in bytes

    $file_type = mime_content_type($_FILES['photo']['tmp_name']);
    $file_size = $_FILES['photo']['size'];

    if (!in_array($file_type, $allowed_types)) {
        json_response(false, "Invalid file type. Only JPG/JPEG allowed.");
    }

    if ($file_size > $max_size) {
        json_response(false, "File size exceeds 2MB limit.");
    }

    $uploads_dir = __DIR__ . '/../uploads/photos';
    if (!is_dir($uploads_dir)) {
        mkdir($uploads_dir, 0777, true);
    }

    $tmp_name = $_FILES['photo']['tmp_name'];
    $filename = uniqid('photo_') . '_' . basename($_FILES['photo']['name']);
    $target_path = "$uploads_dir/$filename";

    if (move_uploaded_file($tmp_name, $target_path)) {
        $form_data['photo_url'] = 'uploads/photos/' . $filename;
    } else {
        json_response(false, "File upload failed");
    }
}


    $success = $cvModel->submit($project_id, $user_id, $form_data);

    if ($success) {
        json_response(true, "CV submitted successfully");
    } else {
        json_response(false, "CV submission failed");
    }
}

function downloadbyManagerCVAsPDF($pdo) {
    require_login();

    if ($_SESSION['user']['role'] === 'user') {
        json_response(false, "Only Admin & manager can download their CV");
    }

    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        json_response(false, "Submission ID required");
    }

    require_once __DIR__ . '/../models/CVSubmission.php';
    require_once __DIR__ . '/../vendor/tecnickcom/tcpdf/tcpdf.php';

    $cvModel = new CVSubmission($pdo);
    $submission = $cvModel->getAllUserCV($id);

    if (!$submission) {
        json_response(false, "No CV found for this project");
    }

    $data = json_decode($submission['data'], true);
    // print_r($data);
   $project_id = $submission['project_id'];
    // ✅ Fetch project name
    $stmt = $pdo->prepare("SELECT name FROM projects WHERE id = ?");
    $stmt->execute([$project_id]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    $project_name = $project ? $project['name'] : "Project $project_id";

    // ✅ Generate PDF
    $pdf = new TCPDF();
    $pdf->AddPage();
    $pdf->SetFont('helvetica', '', 12);
    $pdf->Cell(0, 10, 'CV - Project ID: ' . $project_id, 0, 1);
    $pdf->Cell(0, 10, "CV Submission - $project_name", 0, 1, 'C');
    $pdf->Ln(5); // line break

    $pdf->SetFont('helvetica', '', 12);
    foreach ($data as $field => $value) {
        $pdf->MultiCell(0, 10, "$field: $value", 0, 1);
    }
    $fullname = $data['full_name'] ?? 'N/A';

    $pdf->Output("cv_$project_id"."_"."$fullname.pdf", 'D'); // 'I' = inline, 'D' = download
}

function downloadCVAsPDF($pdo) {
    require_login();

    if ($_SESSION['user']['role'] !== 'user') {
        json_response(false, "Only users can download their CV");
    }

    $project_id = $_GET['project_id'] ?? null;
    
    // $user_id=2; // For testing purposes, hardcoding user_id to 3
    // $user_id = $_SESSION['user']['id']; // Uncomment this line for production use
    if (!$project_id) {
        json_response(false, "Project ID required");
    }

    require_once __DIR__ . '/../models/CVSubmission.php';
    require_once __DIR__ . '/../vendor/tecnickcom/tcpdf/tcpdf.php';

    $cvModel = new CVSubmission($pdo);
    $submission = $cvModel->getUserCV($project_id, $user_id);

    if (!$submission) {
        json_response(false, "No CV found for this project");
    }

    $data = json_decode($submission['data'], true);
    // ✅ Fetch project name
    $stmt = $pdo->prepare("SELECT name FROM projects WHERE id = ?");
    $stmt->execute([$project_id]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    $project_name = $project ? $project['name'] : "Project #$project_id";

    // ✅ Generate PDF
    $pdf = new TCPDF();
    $pdf->AddPage();
    $pdf->SetFont('helvetica', '', 12);
    $pdf->Cell(0, 10, 'CV - Project ID: ' . $project_id, 0, 1);
    $pdf->Cell(0, 10, "CV Submission - $project_name", 0, 1, 'C');
    $pdf->Ln(5); // line break

    $pdf->SetFont('helvetica', '', 12);
    foreach ($data as $field => $value) {
        $pdf->MultiCell(0, 10, "$field: $value", 0, 1);
    }

    $pdf->Output("cv_project_$project_id.pdf", 'I'); // 'I' = inline, 'D' = download
}
function downloadCVAsPPT($pdo) {
    require_login();

    if ($_SESSION['user']['role'] !== 'user') {
        json_response(false, "Only users can download their CV as PPT");
    }

    $project_id = $_GET['project_id'] ?? null;
    
    // $user_id=2; // For testing purposes, hardcoding user_id to 2
    // $user_id = $_SESSION['user']['id']; // Uncomment this line for production use

    if (!$project_id) {
        json_response(false, "Project ID required");
    }

    $cvModel = new CVSubmission($pdo);
    $submission = $cvModel->getUserCV($project_id, $user_id);

    if (!$submission) {
        json_response(false, "No CV found for this project");
    }

    $data = json_decode($submission['data'], true);

    // Get Project Name
    $stmt = $pdo->prepare("SELECT name FROM projects WHERE id = ?");
    $stmt->execute([$project_id]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    $project_name = $project ? $project['name'] : "Project #$project_id";

    // Create Presentation
    $objPHPPpt = new PhpPresentation();
    $slide = $objPHPPpt->getActiveSlide();

    $shape = $slide->createRichTextShape()->setHeight(100)->setWidth(600)->setOffsetX(50)->setOffsetY(30);
    $shape->getActiveParagraph()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $textRun = $shape->createTextRun("CV Submission - $project_name");
    $textRun->getFont()->setBold(true)->setSize(20)->setColor(new Color(Color::COLOR_BLACK));

    $offsetY = 100;

    foreach ($data as $field => $value) {
        $textShape = $slide->createRichTextShape()
            ->setHeight(40)
            ->setWidth(600)
            ->setOffsetX(50)
            ->setOffsetY($offsetY);
        $textShape->getActiveParagraph()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $textRun = $textShape->createTextRun("$field: $value");
        $textRun->getFont()->setSize(14)->setColor(new Color(Color::COLOR_BLACK));
        $offsetY += 45;
    }

    // Output
    header('Content-Disposition: attachment; filename="cv_project_' . $project_id . '.pptx"');
    header('Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation');

    $oWriterPPTX = IOFactory::createWriter($objPHPPpt, 'PowerPoint2007');
    $oWriterPPTX->save('php://output');
}

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

function getAllCVs($pdo) {
    require_login();
    $role = $_SESSION['user']['role'];
    $user_id = $_SESSION['user']['id'];

    if (!in_array($role, ['admin', 'manager'])) {
        json_response(false, "Unauthorized");
    }
    // $role = 'manager';
    // $user_id = 3; // For testing purposes, hardcoding user_id to 3
    // $user_id = $_SESSION['user']['id']; // Uncomment this line for production use    

    if ($role === 'manager') {
        // Managers can only view CVs from their assigned projects
        $stmt = $pdo->prepare("
            SELECT cs.id, cs.project_id, cs.user_id, u.name as user_name, u.email, cs.data, cs.submitted_at, p.name as project_name
            FROM cv_submissions cs
            JOIN users u ON u.id = cs.user_id
            JOIN projects p ON p.id = cs.project_id
            JOIN project_managers pm ON pm.project_id = cs.project_id
            WHERE u.role='user' AND pm.manager_id = ?
            ORDER BY cs.submitted_at DESC
        ");
        $stmt->execute([$user_id]);
    } else {
        // Admins can view all
        $stmt = $pdo->query("
            SELECT cs.id, cs.project_id, cs.user_id, u.name as user_name, u.email, cs.data, cs.submitted_at, p.name as project_name
            FROM cv_submissions cs
            JOIN users u ON u.id = cs.user_id
            JOIN projects p ON p.id = cs.project_id WHERE u.role='user'
            ORDER BY cs.submitted_at DESC
        ");
    }

    $cvs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode JSON field
    foreach ($cvs as &$cv) {
        $cv['data'] = json_decode($cv['data'], true);
    }

    json_response(true, "CV Submissions", $cvs);
}
function exportCVsAsCSV($pdo) {
    require_login();
    $role = $_SESSION['user']['role'];
    $user_id = $_SESSION['user']['id'];

    if (!in_array($role, ['admin', 'manager'])) {
        json_response(false, "Unauthorized");
    }
    // $role = 'manager';
    // $user_id = 3; // For testing purposes, hardcoding user_id to 3
    // Fetch CVs
    if ($role === 'manager') {
        $stmt = $pdo->prepare("
            SELECT cs.*, u.name as user_name, u.email, p.name as project_name
            FROM cv_submissions cs
            JOIN users u ON u.id = cs.user_id
            JOIN projects p ON p.id = cs.project_id
            JOIN project_managers pm ON pm.project_id = cs.project_id
            WHERE pm.manager_id = ?
        ");
        $stmt->execute([$user_id]);
    } else {
        $stmt = $pdo->query("
            SELECT cs.*, u.name as user_name, u.email, p.name as project_name
            FROM cv_submissions cs
            JOIN users u ON u.id = cs.user_id
            JOIN projects p ON p.id = cs.project_id
        ");
    }

    $cvs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$cvs) {
        json_response(false, "No CV submissions found");
    }

    // Build CSV headers dynamically from the first row's data
    $first = json_decode($cvs[0]['data'], true);
    $fieldKeys = array_keys($first);

    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="cv_submissions.csv"');

    $output = fopen('php://output', 'w');

    // Write column headings
    fputcsv($output, array_merge(['Project Name', 'User Name', 'User Email', 'Submitted At'], $fieldKeys));

    foreach ($cvs as $row) {
        $formData = json_decode($row['data'], true);
        $line = [
            $row['project_name'],
            $row['user_name'],
            $row['email'],
            $row['submitted_at']
        ];

        foreach ($fieldKeys as $key) {
            $line[] = $formData[$key] ?? '';
        }

        fputcsv($output, $line);
    }

    fclose($output);
    exit;
}

function exportCVsAsPDFZip($pdo) {
    // require_login();
    // $role = $_SESSION['user']['role'];
    // $user_id = $_SESSION['user']['id'];

    $project_id = $_GET['project_id'] ?? null;
    // if (!$project_id) {
    //     json_response(false, "Missing project_id");
    // }
     $role = 'manager';
    $user_id = 3; // For testing purposes, hardcoding user_id to 3
    // Auth check
    if ($role === 'manager') {
        $check = $pdo->prepare("SELECT 1 FROM project_managers WHERE manager_id = ? AND project_id = ?");
        $check->execute([$user_id, $project_id]);
        if (!$check->fetch()) json_response(false, "Unauthorized");
    } elseif ($role !== 'admin') {
        json_response(false, "Unauthorized");
    }

    require_once __DIR__ . '/../models/CVSubmission.php';
    require_once __DIR__ . '/../vendor/tecnickcom/tcpdf/tcpdf.php';

    $stmt = $pdo->prepare("
        SELECT cs.*, u.name as user_name, u.email
        FROM cv_submissions cs
        JOIN users u ON u.id = cs.user_id
        WHERE cs.project_id = ?
    ");
    $stmt->execute([$project_id]);
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$submissions) json_response(false, "No CVs found");

    $zip = new ZipArchive();
    $zipFile = __DIR__ . "/../temp/cvs_pdf_project_$project_id.zip";

    // Clean old file
    if (file_exists($zipFile)) unlink($zipFile);

    if ($zip->open($zipFile, ZipArchive::CREATE) !== true) {
        json_response(false, "Could not create zip");
    }

    foreach ($submissions as $row) {
        $pdf = new TCPDF();
        $pdf->AddPage();
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 10, "CV: {$row['user_name']}", 0, 1);
        $pdf->SetFont('helvetica', '', 12);

        $data = json_decode($row['data'], true);
        foreach ($data as $key => $val) {
            $pdf->MultiCell(0, 10, "$key: $val", 0, 1);
        }

        $filename = "CV_{$row['user_name']}_{$row['id']}.pdf";
        $pdfPath = __DIR__ . "/../temp/$filename";
        $pdf->Output($pdfPath, 'F');
        $zip->addFile($pdfPath, $filename);
    }

    $zip->close();

    // Send ZIP to browser
    header('Content-Type: application/zip');
    header("Content-Disposition: attachment; filename=cvs_pdf_project_$project_id.zip");
    header('Content-Length: ' . filesize($zipFile));
    readfile($zipFile);

    // Clean up
    foreach (glob(__DIR__ . "/../temp/*.pdf") as $f) unlink($f);
    unlink($zipFile);
    exit;
}
