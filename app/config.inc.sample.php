<?php

// Development stage. Defines the level or error reporting
$cfg['stage'] = 'development';
//$cfg['stage'] = 'staging';
//$cfg['stage'] = 'production';

// Default timezone
$cfg['timezone'] = 'America/Toronto';
date_default_timezone_set('America/Toronto');

// Config variables
$cfg['baseurl']      	= 'http://'.$_SERVER["HTTP_HOST"];
$cfg['url']          	= $cfg['baseurl'] . '/leaderboard-social-putting/app/';
$cfg['img_path']     	= $cfg['url'] . 'view/images/';
$cfg['server_path']  	= __DIR__;
$cfg['salt']         	= '';
$cfg['fb_appId']     	= '';
$cfg['name_char_limit'] = 15;

// Page & Social defaults
$pagedata['title']          = '';
$pagedata['description']    = '';
$pagedata['keywords']       = '';
$pagedata['og:site_name']   = '';
$pagedata['og:title']       = '';
$pagedata['og:description'] = '';
$pagedata['og:image']       = $cfg['url'] . 'view/images/fb_share.png';

// Database
define ("DB_HOST", "localhost");
define ("DB_USER", "root");
define ("DB_PASS", "root");
define ("DB_NAME", "leaderboard_golf");

?>