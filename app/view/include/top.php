<!DOCTYPE html>
<html>
	<head>

		<title><?php echo ($pagedata['title']); ?></title>
		<link rel="icon" href="<?php echo $cfg['img_path']; ?>favicon-32x32.png" type="image/png" sizes="32x32">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="description" content="<?php echo ($pagedata['description']); ?>">
		<meta name="keywords" content="<?php echo ($pagedata['keywords']); ?>">
		<meta property="og:site_name" content="<?php echo ($pagedata['og:site_name']); ?>" />
		<meta property="og:locale" content="en_us" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content="<?php echo ($pagedata['og:title']); ?>" />
		<meta property="og:url" content="<?php echo ($cfg['url']) . ($page); ?>" />
		<meta property="og:description" content="<?php echo ($pagedata['og:description']); ?>" />
		<meta property="og:image" content="<?php echo ($pagedata['og:image']); ?>" />
		<meta property="fb:app_id" content="<?php echo ($cfg['fb_appId']); ?>" />

		<?php
		// Include page CSS
		getCSS('normalize');
		getCSS('universal');
		if (isset($required_css)) { foreach ($required_css as $library) { getCSS($library); } }
		?>
		
	</head>

	<body class="<?php echo $screen; ?>-screen">
		<?php if ($cfg['stage'] == 'production' && FALSE) { ?>
			<!-- Google Analytics -->

			<script>
				<?php if (isset($pagedata['GA_pageViewValue'])) { ?>
					ga('send', 'pageview', '<?php echo ($pagedata['GA_pageViewValue']); ?>');
				<?php } else { ?>
					ga('send', 'pageview');
				<?php } ?>
			</script>

		<?php } ?>
		
		<script>
			var event_action = 'click';
			if ('ontouchstart' in document.documentElement)
				event_action = 'touchstart';
			
			console.log(event_action);
			
			var cfg_url = '<?php echo $cfg['url']; ?>';
			var cfg_screen = '<?php echo $screen; ?>';
		</script>
		