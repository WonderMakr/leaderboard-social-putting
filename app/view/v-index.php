<?php include ('include/top.php'); ?>

<div id="page-content">

	<?php if ($screen == 'small') : ?>
	
		<div id="header">
			<img id="w-logo" class="b4-animate" src="<?php echo $cfg['img_path']; ?>logo-white.png" />
			<h3 class="playHere b4-animate"><span class="play">Play Here, </span><span class="legend">Become a Legend</span></h3>
		</div>

		<div id="start" class="button large b4-animate">Start</div>
		<br>
		<div id="games" class="button b4-animate<?php echo (payment_system() == 'free_play') ? ' freeplay' : ''; ?>">Games</div>
		<br>
		<?php if (payment_system() != 'swipe') : ?>
		<p class="available">Available Credits: <span id="credits"><?php echo numOfCredits(); ?></span></p>
		<?php endif; ?>
		<p id="error"></p>
	
	<?php else : ?>
	
		<img id="w-logo" class="b4-animate" src="<?php echo $cfg['img_path']; ?>logo-white.png" />
		<h3 class="playHere b4-animate"><span class="play">Play Here, </span><span class="legend">Become a Legend</span></h3>

		<div id="video-cont">
			<video id="attract-video"><source src="<?php echo $cfg['vid_path']; ?>attract-video.mp4" type="video/mp4"></video>
			<div id="green-overlay"></div>
			<div id="ten-foot-putt"></div>
		</div>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>