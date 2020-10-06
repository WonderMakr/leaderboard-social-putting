<?php include ('include/top.php'); ?>

<div id="page-content">

	<?php if ($screen == 'small') : ?>
	
		<div id="header">
			<img id="w-logo" class="b4-animate" src="<?php echo $cfg['img_path']; ?>logo-white.png" />
			<h3 class="playHere b4-animate"><span class="play"><?php echo $lang_play_here; ?> </span><span class="legend"><?php echo $lang_be_legend; ?></span></h3>
		</div>

		<div id="start" class="button large b4-animate"><?php echo $lang_start; ?></div>
		<br>
		<div id="games" class="button b4-animate<?php echo (payment_system() == 'free_play') ? ' freeplay' : ''; ?>"><?php echo $lang_games; ?></div>
		<br>
		<p class="available"><?php echo $lang_aval_cred; ?>: <span id="credits"><?php echo numOfCredits(); ?></span></p>
		<p id="error"></p>
	
	<?php else : ?>
	
		<img id="w-logo" class="b4-animate" src="<?php echo $cfg['img_path']; ?>logo-white.png" />
		<h3 class="playHere b4-animate"><span class="play"><?php echo $lang_play_here; ?> </span><span class="legend"><?php echo $lang_be_legend; ?></span></h3>

		<div id="video-cont">
			<video id="attract-video"><source src="<?php echo $cfg['vid_path']; ?>attract-video.mp4" type="video/mp4"></video>
			<div id="green-overlay"></div>
			<div id="ten-foot-putt"></div>
		</div>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>