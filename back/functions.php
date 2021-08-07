<?php
class Projects {
    public static function readAll(){
        require 'db.php';
        try {
            $pgUpdate = $connection->prepare('SELECT * FROM projects');
            $pgUpdate->bindParam(':pg', $pg);
        } catch (\PDOException $e) {
            return array('status' => false, 'error' => $e->getMessage());
        }
    }
}

?>