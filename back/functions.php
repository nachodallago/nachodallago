<?php
class Projects
{
    public static function readAll()
    {
        require 'db.php';
        try {
            $pgUpdate = $connection->prepare('SELECT * FROM projects');
            $pgUpdate->bindParam(':pg', $pg);
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
