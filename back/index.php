<?php
    $return = array();
    
    if(isset($_REQUEST['type'])){
        include_once 'config.php';
        require 'functions.php';
        $type=$_REQUEST['type'];
        switch ($type) {
            case 'steam':
                $return = Gaming::steamInfo();
                break;
            
            default:
                # code...
                break;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($return, JSON_UNESCAPED_UNICODE);
?>