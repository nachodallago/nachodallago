<?php
try {
	$conn = new PDO('mysql:host=localhost;dbname=root;charset=utf8mb4', "root", "" );
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
} catch (PDOException $ex) {

}
?>
