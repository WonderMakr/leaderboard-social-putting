<?php

// Required CSS and JS
$required_css = array('keyboard', 'num-of-players');
$required_js = array('keyboard' => 1, 'num-of-players' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";

$game_name = isset($_GET['game']) ? filter_var($_GET['game'], FILTER_SANITIZE_STRING) : 0;

if (!isActiveGame($game_name)) {
	header("Location: " . $cfg['default_url']);
	exit();
}

$pay_system = payment_system();

// Load the view
require ($cfg['server_path'].'/view/v-num-of-players.php');

?>