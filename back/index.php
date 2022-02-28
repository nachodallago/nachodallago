<?php
$return = array();

if (isset($_REQUEST['type'])) {
    include_once 'config.php';
    require 'functions.php';
    $type = $_REQUEST['type'];
    switch ($type) {
        case 'steam':
            $return = Gaming::steamInfo();
            break;
        case 'projects':
            $return = Projects::readAll(3);
            break;
            case 'projectsAll':
                $return = Projects::readAll();
                break;
        case 'singleproject':
            $url = $_REQUEST['url'];
            $return = Projects::readSingle($url);
            break;
        case 'shop':
            $return = Shop::readAll();
            break;
        case 'singleshop':
            $url = $_REQUEST['url'];
            $return = Shop::readSingle($url);
            break;
    }
}

header('Content-Type: application/json');
echo json_encode($return, JSON_UNESCAPED_UNICODE);
