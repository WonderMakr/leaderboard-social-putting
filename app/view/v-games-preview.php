<?php include ('include/top.php'); ?>

<div id="page-content">
	
	<div id="header"><img id="g-logo" src="<?php echo $cfg['img_path']; ?>logo-green.jpg" /></div>
	
	<?php $activeGames = getActiveGames(); ?>
	
	<div id="games" class="active<?php echo count($activeGames); ?>">
		
		<?php foreach ($activeGames as $slug) : ?>
		
		<div class="game">
			
			<?php if ($screen == 'big') : ?>
			
			<div class="golf-ball b4-animate">
				<img class="b4-animate" src="<?php echo $cfg['img_path'] . $slug; ?>.png" /><br>
			</div>
			
			<?php else : ?>
				<img src="<?php echo $cfg['img_path'] . $slug; ?>.png" /><br>
			<?php endif; ?>
			
			<?php if ($screen == 'small') : ?>
			<div class="button" data-link="game-instructions?game=<?php echo $slug; ?>"><?php echo $lang_how_to_play; ?></div>
			<?php endif; ?>
			
		</div>
		
		<?php endforeach; ?>
		
	</div>
	
	<?php if ($screen == 'small') : ?>

		<div class="t-center">
			<div class="back button"><?php echo $lang_back; ?></div>
		</div>
		
		<p class="t-center"><?php echo $lang_aval_cred . ': ' . numOfCredits(); ?></p>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>