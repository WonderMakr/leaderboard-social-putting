<?php

// Required CSS and JS
$required_css = array('attract');
$required_js = array('attract' => 1);
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";

session_unset();

// Load the view
require ($cfg['server_path'].'/view/v-attract.php');

?>