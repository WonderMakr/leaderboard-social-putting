<?php include ('include/top.php'); ?>

<div id="page-content">

	<div id="header">
		<img id="w-logo" src="<?php echo $cfg['img_path']; ?>logo-white.png" />
		<h3>Play Here, Become a Legend</h3>
	</div>
	
	<?php if ($screen == 'small') : ?>
	
	<div id="start" class="button large">Start</div>
	<br>
	<div id="games" class="button<?php echo (payment_system() == 'free_play') ? ' freeplay' : ''; ?>">Games</div>
	<br>
	<p class="available">Available Credits: <span id="credits"><?php echo numOfCredits(); ?></span></p>
	<p id="error"></p>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>