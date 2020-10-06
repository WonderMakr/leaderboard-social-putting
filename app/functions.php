<?php

function getCSS($lib) {
	global $cfg;
	
	$lib_version = explode("?",$lib);
	$lib = $lib_version[0];
	$version = isset($lib_version[1]) ? "?".$lib_version[1] : "?v=0.06";
	
	$output = '<link href="'.$cfg['url'].'view/css/'.$lib.'.css'.$version.'" rel="stylesheet" type="text/css" />';
	echo ($output."\n\t\t");
}

function getJS($lib, $hosted) {
	global $cfg;
	if ($hosted == 1) {
		$lib_version = explode("?",$lib);
		$lib = $lib_version[0];
		$version = isset($lib_version[1]) ? "?".$lib_version[1] : "?v=0.06";

		$output = '<script src="'.$cfg['url'].'view/js/'.$lib.'.js'.$version.'" type="text/javascript"></script>';
	} else {
		$output = '<script src="'.$lib.'" type="text/javascript"></script>';
	}
	echo ($output."\n\t\t");
}

function getModal($mod) {
	global $cfg;
	global $userType;
	include ($cfg['server_path'].'view/include/modal-'.$mod.'.php');
}

function trim_value(&$value) {
	$value = trim($value);
}

function isValidLanguage($language) {
	$valid_langs = array('en');
	return in_array($language, $valid_langs);
}

function isValidScreen($screen) {
	$valid_screens = array('small', 'big');
	return in_array($screen, $valid_screens);
}

function getActiveGames() {
	
	global $db;
	
	try {		
		$sql = "SELECT slug FROM game_types WHERE active = 1";
		$select = $db->prepare($sql);
		$select->execute();
		$games = $select->fetchAll(PDO::FETCH_COLUMN);

	} catch (PDOException $e) {
		echo $e->getMessage();
	}
	
	return $games;
	
}

function isActiveGame($game) {
	return in_array($game, getActiveGames());
}

function getGameTypeID($game) {
	
	global $db;
	
	try {		
		$sql = "SELECT id FROM game_types WHERE `slug` = :slug";
		$select = $db->prepare($sql);
		$select->execute(array("slug" => $game));
		$game_id = $select->fetch(PDO::FETCH_COLUMN);

	} catch (PDOException $e) {
		echo $e->getMessage();
	}
	
	return $game_id;
}

function getMetaValue($meta_data) {
	
	global $db;
	
	try {		
		$sql = "SELECT meta_value FROM game_data WHERE meta_data = :meta_data";
		$select = $db->prepare($sql);
		$select->execute(array("meta_data" => $meta_data));
		$meta_value = $select->fetch(PDO::FETCH_COLUMN);

	} catch (PDOException $e) {
		echo $e->getMessage();
	}
	
	if ($meta_value === false)
		return -1;
		
	else
		return $meta_value;
}

function numOfCredits() {
	if (getMetaValue('payment') == 'free_play')
		return '<em>Free Play</em>';
	else
		return getMetaValue('credits');	
}

function payment_system() {
	return getMetaValue('payment');
}

function gameInProgress() {
	
	global $db;
	
	try {
		
		$sql = "SELECT * FROM games WHERE status = 'in_progress' ORDER BY updated_at DESC";
		$select = $db->prepare($sql);
		$select->execute();
		$game = $select->fetch(PDO::FETCH_ASSOC);

	} catch (PDOException $e) {
		echo $e->getMessage();
	}
	
	return $game;
	
}

function getGameFromID($id) {
	
	global $db;
	
	try {
		
		$sql = "SELECT slug FROM game_types WHERE id = :id";
		$select = $db->prepare($sql);
		$select->execute(array("id" => $id));
		$game_slug = $select->fetch(PDO::FETCH_COLUMN);

	} catch (PDOException $e) {
		echo $e->getMessage();
	}
	
	return $game_slug;
	
}
function getPlayersFromGameID($game_id) {
	
	global $db;
	
	try {
		
		$sql = "SELECT * FROM players WHERE game_id = :game_id";
		$select = $db->prepare($sql);
		$select->execute(array("game_id" => $game_id));
		$players = $select->fetchAll(PDO::FETCH_ASSOC);

	} catch (PDOException $e) {
		echo $e->getMessage();
	}
	
	return $players;
	
}

?>