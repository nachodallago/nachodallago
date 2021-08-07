<?php
    $return = array();
    
    if(isset($_REQUEST['type'])){
        include_once 'config.php';
        require 'functions.php';
    }
    
    header('Content-Type: application/json');
    echo json_encode($return, JSON_UNESCAPED_UNICODE);
?>