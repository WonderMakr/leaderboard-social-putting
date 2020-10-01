<?php

// Required CSS and JS
$required_css = array('select-game');
$required_js = array('select-game' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";


// Load the view
require ($cfg['server_path'].'/view/v-select-game.php');

?>