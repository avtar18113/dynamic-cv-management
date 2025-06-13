<?php
class Project {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $stmt = $this->pdo->prepare("
            INSERT INTO projects (name, slug, logo_url, header_image, start_date, end_date, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            $data['name'],
            $data['slug'],
            $data['logo_url'] ?? null,
            $data['header_image'] ?? null,
            $data['start_date'],
            $data['end_date'],
            $data['created_by']
        ]);
    }

    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM projects ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
