<?php include ('include/top.php'); ?>

<script>
	cfg_fade_time = <?php echo $cfg['fade_time']*2; ?>;
</script>

<div id="page-content">

	<img id="w-logo" class="b4-animate" src="<?php echo $cfg['img_path']; ?>logo-white.png" />
	<h3 class="playHere b4-animate"><span class="play">Play Here, </span><span class="legend">Become a Legend</span></h3>
	
	<div id="video-cont">
		<video id="attract-video"><source src="<?php echo $cfg['vid_path']; ?>attract-video.mp4" type="video/mp4"></video>
		<div id="green-overlay"></div>
	</div>
	
	<?php if ($screen == 'small') : ?>
	<div id="touch">Tap Anywhere to begin</div>
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>