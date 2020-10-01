<?php

// Required CSS and JS
$required_css = array('game-play');
$required_js = array('game-play' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";

$current_game = gameInProgress();

if (!$current_game) {
	header("Location: " . $cfg['default_url']);
	exit();
}

//var_dump($current_game);

$players = getPlayersFromGameID($current_game['id']);
$game_name = getGameFromID($current_game['game_type_id']);

// Load the view
require ($cfg['server_path'].'/view/v-game-play.php');

?>