<?php

// Required CSS and JS
$required_css = array('games-preview');
$required_js = array('games-preview' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";


// Load the view
require ($cfg['server_path'].'/view/v-games-preview.php');

?>