<?php

// Required CSS and JS
$required_css = array();
$required_js = array();
$required_modal = array();

$pagedata['title']          = "";
$pagedata['description']    = "";
$pagedata['og:title']       = "";
$pagedata['og:description'] = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

} else {
  // Load the view
  require ($cfg['server_path'].'/view/v-404.php');
}

?>
