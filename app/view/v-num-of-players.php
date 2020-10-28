<?php include('include/top.php'); ?>
<?php include('include/purchase-popup.php'); ?>

<video id="lines-video" class="video"><source src="<?php echo $cfg['vid_path']; ?>green-lines.mp4" type="video/mp4"></video>

<script>
	var game_name = '<?php echo $game_name; ?>';
	var cfg_credit_price = '<?php echo credit_price(); ?>';
	
	var js_err_invalid_card = '<?php echo $lang_js_err_invalid_card; ?>';
	var js_err_slash_reg_cred = '<?php echo $lang_js_err_slash_reg_cred; ?>';
	var js_err_one_cred_is = '<?php echo $lang_js_err_one_cred_is; ?>';
</script>

<div id="page-content" class="w30-w70">
	
	<div class="w30">
		<div id="header"><img id="g-logo-png" src="<?php echo $cfg['img_path']; ?>logo-score.png" /></div>
		<img id="game-img" src="<?php echo $cfg['img_path'].$game_name; ?>.png" />
	</div>
	
	<div class="w70 <?php echo $pay_system; ?>">
		
		<h3><?php echo $lang_num_of_players; ?></h3>
		
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
		
		<p id="aval_cred" class="t-center"><?php echo $lang_aval_cred . ': ' . numOfCredits(); ?><span id="error"><br><?php echo $lang_one_ply_is_one_cred. ' | ' . $lang_one_cred_is . credit_price(); ?></span></p>
		
			<?php if ($pay_system == 'credits') : ?>
				<div class="t-center"><div id="purchase" class="button"><?php echo $lang_purchase; ?></div></div>
			<?php endif; ?>
		
		<?php endif; ?>
		
	</div>
	
</div>

<?php include ('include/bottom.php'); ?>