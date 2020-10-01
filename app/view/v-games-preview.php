<?php include ('include/top.php'); ?>

<div id="page-content">
	
	<div id="header"><img src="<?php echo $cfg['img_path']; ?>logo-green.jpg" /></div>
	
	<?php $activeGames = getActiveGames(); ?>
	
	<div id="games">
		
		<?php foreach ($activeGames as $slug) : ?>
		
		<div class="game">
			
			<img src="<?php echo $cfg['img_path'] . $slug; echo ($screen == 'big') ? '-lrg' : ''; ?>.png" /><br>
			
			<?php if ($screen == 'small') : ?>
			<div class="button" data-link="game-instructions?game=<?php echo $slug; ?>">How To Play</div>
			<?php endif; ?>
			
		</div>
		
		<?php endforeach; ?>
		
	</div>
	
	<?php if ($screen == 'small') : ?>

		<div class="t-center">
			<div class="back button">Back</div>
		</div>

		<p class="available t-center">Available Credits: <?php echo numOfCredits(); ?></p>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>