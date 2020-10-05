<?php include ('include/top.php'); ?>

<div id="page-content">

	<div id="header">
		<img id="w-logo" class="b4-animate" src="<?php echo $cfg['img_path']; ?>logo-white.png" />
		<h3 class="playHere b4-animate"><span class="play">Play Here, </span><span class="legend">Become a Legend</span></h3>
	</div>
	
	<?php if ($screen == 'small') : ?>
	
	<div id="start" class="button large b4-animate">Start</div>
	<br>
	<div id="games" class="button b4-animate<?php echo (payment_system() == 'free_play') ? ' freeplay' : ''; ?>">Games</div>
	<br>
	<p class="available">Available Credits: <span id="credits"><?php echo numOfCredits(); ?></span></p>
	<p id="error"></p>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>