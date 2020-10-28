<?php include ('include/top.php'); ?>

<video id="games-video" class="video"><source src="<?php echo $cfg['vid_path']; ?>game-logos.mp4" type="video/mp4"></video>

<div id="page-content">
	
	<?php $activeGames = getActiveGames(); ?>
	
	<div id="games" class="active<?php echo count($activeGames); ?>">
		
		<?php foreach ($activeGames as $slug) : ?>
		
		<div class="game">
			
			<?php if ($screen == 'small') : ?>
				<div data-link="num-of-players?game=<?php echo $slug; ?>" class="button"><?php echo $lang_play_now; ?></div><br>
				<div class="how-to" data-link="game-instructions?game=<?php echo $slug; ?>"><?php echo $lang_how_to_play; ?></div>
			<?php endif; ?>
			
		</div>
		
		<?php endforeach; ?>
		
	</div>
	
	<?php if ($screen == 'small') : ?>
	
		<div class="t-center">
			<div class="back button"><?php echo $lang_back; ?></div>
		</div>

		<p class="t-center"><?php echo $lang_aval_cred . ': ' . numOfCredits(); ?></p>

	<?php else : ?>
	
		<h2><?php echo $lang_choose_game; ?></h2>
	
	<?php endif; ?>
	
</div>

<?php include ('include/bottom.php'); ?>