<?php include ('include/top.php'); ?>

<div id="page-content" class="w30-w70">
	
	<div class="w30">
		<div id="header"><img id="g-logo" src="<?php echo $cfg['img_path']; ?>logo-green.jpg" /></div>
		<img id="game-img" src="<?php echo $cfg['img_path'].$game_name; ?>.png" />
	</div>
	
	<div class="w70">
		
		<div class="instructions">

			<div class="center">

				<h3><?php echo $lang_game_instructions; ?></h3>

				<ol>
					<?php foreach($instructions[$game_name] as $instruction) {
						echo '<li class="b4-animate">'.$instruction.'</li>';
					} ?>
				</ol>
			
			</div>
			
		</div>
		
		<?php if ($screen == 'small') : ?>
		
			<div class="t-center">
				<div class="back button"><?php echo $lang_back; ?></div>
			</div>

			<p class="available t-center"><?php echo $lang_aval_cred . ': ' . numOfCredits(); ?></p>
		
		<?php endif; ?>
		
	</div>
	
</div>

<?php include ('include/bottom.php'); ?>