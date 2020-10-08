<?php

// Set the error reporting based on development stage
if ($cfg['stage'] == 'development') {

	ini_set('display_errors', '1');
	error_reporting(E_ALL);

} else if ($cfg['stage'] == 'staging') {

	ini_set('display_errors', '0');
	error_reporting(0);

} else if ($cfg['stage'] == 'production') {

	ini_set('display_errors', '0');
	error_reporting(0);

} else {

	// If unset, display no errors
	ini_set('display_errors', '0');
	error_reporting(0);

}

// Connect to DB
if (DB_USER != "") {
	try {
		$db = new PDO('mysql:dbname='.DB_NAME.';host='.DB_HOST.';charset=utf8', DB_USER, DB_PASS);
		$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		$db->exec("SET NAMES utf8mb4");
	} catch (PDOException $e) {
		echo $e->getMessage();
	}
	$cfg['total_rounds'] = totalRounds();
}
?>