<?php
try {
	$conn = new PDO('mysql:host=localhost;dbname=ndl;charset=utf8mb4', "root", "" );
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
} catch (PDOException $ex) {
	echo 'error';
}
?>
