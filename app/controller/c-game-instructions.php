<?php

// Required CSS and JS
$required_css = array('game-instructions');
$required_js = array('game-instructions' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";

$game_name = isset($_GET['game']) ? filter_var($_GET['game'], FILTER_SANITIZE_STRING) : 0;

if (!in_array($game_name, array('six-hole', 'mark-0', 'lights-out'))) {
	header("Location: " . $cfg['url'] . "en/index");
	exit();
}
	

// Load the view
require ($cfg['server_path'].'/view/v-game-instructions.php');

?>