<?php

// Required CSS and JS
$required_css = array('index');
$required_js = array('index' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";

session_unset();

// Load the view
require ($cfg['server_path'].'/view/v-index.php');

?>