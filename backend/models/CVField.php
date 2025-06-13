<?php
class CVField {
    private $pdo;
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $stmt = $this->pdo->prepare("
            INSERT INTO cv_fields (project_id, field_name, field_type, is_required, validation)
            VALUES (?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            $data['project_id'],
            $data['field_name'],
            $data['field_type'],
            $data['is_required'] ?? 0,
            $data['validation'] ?? ''
        ]);
    }

    public function getByProject($project_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM cv_fields WHERE project_id = ?");
        $stmt->execute([$project_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
