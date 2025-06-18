<?php

class CVSubmission {
    private $pdo;

    public function __construct( $pdo ) {
        $this->pdo = $pdo;
    }

    public function hasSubmitted( $project_id, $user_id ) {
        $stmt = $this->pdo->prepare( 'SELECT id FROM cv_submissions WHERE project_id = ? AND user_id = ?' );
        $stmt->execute( [ $project_id, $user_id ] );
        return $stmt->fetch( PDO::FETCH_ASSOC );
    }

    public function submitWithPhoto( $project_id, $user_id, $data, $photoPath ) {
        $stmt = $this->pdo->prepare( "
        INSERT INTO cv_submissions (project_id, user_id, data, photo_path)
        VALUES (?, ?, ?, ?)
    " );
        return $stmt->execute( [ $project_id, $user_id, json_encode( $data ), $photoPath ] );
    }

    public function submit( $project_id, $user_id, $jsonData ) {
        $stmt = $this->pdo->prepare( 'INSERT INTO cv_submissions (project_id, user_id, data) VALUES (?, ?, ?)' );
        return $stmt->execute( [ $project_id, $user_id, json_encode( $jsonData ) ] );
    }

    public function getUserCV( $project_id, $user_id ) {
        $stmt = $this->pdo->prepare( 'SELECT * FROM cv_submissions WHERE project_id = ? AND user_id = ?' );
        $stmt->execute( [ $project_id, $user_id ] );
        return $stmt->fetch( PDO::FETCH_ASSOC );
    }

    public function getAllUserCV( $id ) {
        $stmt = $this->pdo->prepare( 'SELECT * FROM cv_submissions WHERE id = ?' );
        $stmt->execute( [ $id ] );
        return $stmt->fetch( PDO::FETCH_ASSOC );
    }
}
