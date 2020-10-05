<?php include ('include/top.php'); ?>

<script>
	var game_name = '<?php echo $game_name; ?>';
</script>

<div id="page-content" class="w30-w70">
	
	<div class="w30">
		<div id="header"><img id="g-logo" src="<?php echo $cfg['img_path']; ?>logo-green.jpg" /></div>
		<img id="game-img" src="<?php echo $cfg['img_path'].$game_name; ?>.png" />
	</div>
	
	<div class="w70">
		
		<div id="num-toggle">
			
			<div id="num">
				<div id="num_scroll">
				<?php for ($i=0; $i<9; $i++) {
					$current = ($i==0) ? ' current' : '';
					echo '<div class="num'.$current.'">'.$i.'</div>';
				} ?>
				</div>
			</div>
			
			<?php if ($screen == 'small') : ?>
			<div id="toggles">
				<div class="plus">+</div>
				<div class="spacer"></div>
				<div class="minus">-</div>
			</div>
			<?php endif; ?>
			
		</div>
		
		<?php if ($screen == 'small') : ?>
		<div class="t-center">
			<div class="back button">Back</div>
			<div class="next button"><?php echo (payment_system() == 'swipe') ? 'Pay Now' : 'Next'; ?></div>
		</div>
		
			<?php if (payment_system() == 'swipe') : ?>
			<p class="t-center">Pay to play: 1 Credit is $5<span id="error"></span></p>
			<?php else : ?>
			<p class="t-center">Available Credits: <?php echo numOfCredits(); ?><span id="error"></span></p>
			<?php endif; ?>
		
		<?php endif; ?>
		
	</div>
	
</div>

<?php include ('include/bottom.php'); ?>