<?php

// Required CSS and JS
$required_css = array('keyboard', 'player-names');
$required_js = array('keyboard' => 1, 'player-names' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";

$num_of_players = isset($_GET['players']) ? filter_var($_GET['players'], FILTER_SANITIZE_NUMBER_INT) : 0;
$game_name = isset($_GET['game']) ? filter_var($_GET['game'], FILTER_SANITIZE_STRING) : 0;
$nameCharLimit = nameCharLimit();

if (!isActiveGame($game_name) || $num_of_players < 1) {
	header("Location: " . $cfg['default_url']);
	exit();
}

// Load the view
require ($cfg['server_path'].'/view/v-player-names.php');

?>