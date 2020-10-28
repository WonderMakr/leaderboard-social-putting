<?php include ('include/top.php'); ?>

<video id="attract-video1" class="attract-video"><source src="<?php echo $cfg['vid_path']; ?>attract-video1.mp4" type="video/mp4"></video>
<video id="attract-video2" class="attract-video"><source src="<?php echo $cfg['vid_path']; ?>attract-video2.mp4" type="video/mp4"></video>

<div id="page-content">

	<?php if ($screen == 'small') : ?>
	
		<div id="header"></div>

		<div id="start" class="button large b4-animate"><?php echo $lang_start; ?></div>
		<br>
		<div id="games" class="button b4-animate<?php echo (payment_system() == 'free_play') ? ' freeplay' : ''; ?>"><?php echo $lang_games; ?></div>
		<br>
		<p class="available"><?php echo $lang_aval_cred; ?>: <span id="credits"><?php echo numOfCredits(); ?></span></p>
		<p id="error"></p>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>