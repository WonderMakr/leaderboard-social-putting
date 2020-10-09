<?php include ('include/top.php'); ?>
<?php include('include/purchase-popup.php'); ?>

<script>
	var game_name = '<?php echo $game_name; ?>';
	var cfg_credit_price = '<?php echo credit_price(); ?>';
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
			<div class="back button"><?php echo $lang_back; ?></div>
			<div class="next button"><?php echo $lang_next; ?></div>
		</div>
		
		<p id="aval_cred" class="t-center"><?php echo $lang_aval_cred . ': ' . numOfCredits(); ?><span id="error"><br>&nbsp;</span></p>
		
		<div class="t-center"><div id="purchase" class="button"><?php echo $lang_purchase; ?></div></div>
		<?php endif; ?>
		
	</div>
	
</div>

<?php include ('include/bottom.php'); ?>