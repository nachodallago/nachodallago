<?php
class Projects
{
    public static function readAll(int $limit=10,int $start=0)
    {
        require 'db.php';
        try {
            $pgReadAll = $conn->prepare("SELECT title,url_image as image, url FROM works ORDER BY id DESC LIMIT $start, $limit");
            $pgReadAll->execute();
            return $pgReadAll->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return array('status' => false, 'error' => $e->getMessage());
        }
    }
    public static function readSingle(string $url)
    {
        require 'db.php';
        try {
            $pgSingle = $conn->prepare("SELECT title,url_image as image, body as content, features,status FROM works WHERE url=:url");
            $pgSingle->bindParam(':url',$url);
            $pgSingle->execute();
            return $pgSingle->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return array('status' => false, 'error' => $e->getMessage());
        }
    }
    
}

class Shop
{
    public static function readAll(int $limit=10,int $start=0)
    {
        require 'db.php';
        try {
            $pgReadAll = $conn->prepare("SELECT title,url_image as image, price,url FROM shop WHERE status = 'active' ORDER BY id DESC LIMIT $start, $limit");
            $pgReadAll->execute();
            return $pgReadAll->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return array('status' => false, 'error' => $e->getMessage());
        }
    }
    public static function readSingle(string $url)
    {
        require 'db.php';
        try {
            $pgSingle = $conn->prepare("SELECT title,url_image as image, price, btn_mercadopago as btn, description as content FROM shop WHERE status = 'active' AND url=:url");
            $pgSingle->bindParam(':url',$url);
            $pgSingle->execute();
            return $pgSingle->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return array('status' => false, 'error' => $e->getMessage());
        }
    }
    
}

class Gaming
{
    public static function steamInfo()
    {
        $xml = simplexml_load_file("https://steamcommunity.com/id/nachodallago?xml=" . time());

        $steam_online = (string)$xml->onlineState;
        $steam_avatar = (string)$xml->avatarFull;
        $steam_name = (string)$xml->steamID;
        
        if ($steam_online == 'in-game') {
            $game_name = (string)$xml->inGameInfo->gameName;
            $game_icon = (string)$xml->inGameInfo->gameIcon;
            $game_info = array('game' => $game_name, 'icon' => $game_icon);
            return array('status' => $steam_online, 'name' => $steam_name, 'avatar' => $steam_avatar, 'in_game'=>$game_info);
        } else {
            return array('status' => $steam_online, 'name' => $steam_name, 'avatar' => $steam_avatar);
        }

    }
}
