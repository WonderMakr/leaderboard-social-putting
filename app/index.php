<?php

session_start();

require ("config.inc.php");
require ("functions.php");
require ("init.php");


// Figure out the page
if (!isset($_GET['p'])) {
	
	$screen = 'small';
	$lang = 'en';
	$page = 'index';
	header("Location: " . $cfg['url'] . "$screen/$lang/$page");
	exit();
	
} else {
	
	$urlParts = explode('/', $_GET['p']);
	if (count($urlParts) != 3) {
		header("Location: " . $cfg['url']);
		exit();
	} else {
		$screen = $urlParts[0];
		$lang = $urlParts[1];
		$page = $urlParts[2];
		$cfg['default_url'] = $cfg['url']."$screen/en/index";
	}
}

if (!isValidLanguage($lang) || !isValidScreen($screen)) {
	header("Location: " . $cfg['url']);
	exit();
}

if (gameInProgress() && $page != 'game-play' && $page != 'process') {
	header("Location: " . $cfg['url'] . "$screen/$lang/game-play");
	exit();
}

include_once("view/locale/$lang.php");
$controller = 'controller/c-'.$page.'.php';

if (file_exists($controller)) {
	include($controller);
} else {
	header("Location: " . $cfg['url']);
	exit();
	include('controller/c-404.php');
}

?>