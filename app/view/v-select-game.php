<?php include ('include/top.php'); ?>

<div id="page-content">
	
	<div id="header"><img src="<?php echo $cfg['img_path']; ?>logo-green.jpg" /></div>
	
	<?php $activeGames = getActiveGames(); ?>
	
	<div id="games" class="active<?php echo count($activeGames); ?>">
		
		<?php foreach ($activeGames as $slug) : ?>
		
		<div class="game">
			
			<img src="<?php echo $cfg['img_path'] . $slug; echo ($screen == 'big') ? '-lrg' : ''; ?>.png" /><br>
			
			<?php if ($screen == 'small') : ?>
			<div data-link="num-of-players?game=<?php echo $slug; ?>" class="button">Play Now</div><br>
			<div class="how-to" data-link="game-instructions?game=<?php echo $slug; ?>">How To Play</div>
			<?php endif; ?>
			
		</div>
		
		<?php endforeach; ?>
		
	</div>
	
	<?php if ($screen == 'small') : ?>
	
		<div class="t-center">
			<div class="back button">Back</div>
		</div>

		<p class="t-center">Available Credits: <?php echo numOfCredits(); ?></p>
	
	<?php else : ?>
	
		<h2>Choose the game you want to play</h2>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>