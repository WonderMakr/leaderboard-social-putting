<?php include ('include/top.php'); ?>

<script>
	var game_name = '<?php echo $game_name; ?>';
	var num_of_players = <?php echo $num_of_players; ?>;
	var char_limit = <?php echo $nameCharLimit; ?>;
</script>

<video id="lines-video" class="video"><source src="<?php echo $cfg['vid_path']; ?>green-lines.mp4" type="video/mp4"></video>

<div id="page-content" class="w30-w70">
	
	<div class="w30">
		<div id="header"><img id="g-logo-png" src="<?php echo $cfg['img_path']; ?>logo-score.png" /></div>
		<img id="game-img" src="<?php echo $cfg['img_path'].$game_name; ?>.png" />
	</div>
	
	<div class="w70">
		
		<h3><?php echo $lang_enter_pl_name; ?></h3>
		
		<?php if ($screen == 'small') : ?>
		
		<h4><?php echo $lang_max . $nameCharLimit . $lang_characters; ?></h4>
		
		<div class="input">
			<input type="text" id="player" maxlength="<?php echo $nameCharLimit; ?>" />
			<div id="name_error"></div>
		</div>
		
		<?php include ('include/keyboard.php'); ?>
		
		<div class="t-center">
			<div class="back button"><?php echo $lang_back; ?></div>
			<div class="next button"><?php echo $lang_next; ?></div>
		</div>
		
		<?php else : ?>
		
			<ol>
			<?php for ($pl=0; $pl<$num_of_players; $pl++) : ?>
				<li id="pl<?php echo $pl+1; ?>"><span class="name"></span></li>
			<?php endfor; ?>
			</ol>
		
		<?php endif; ?>
		
	</div>
	
</div>

<?php include ('include/bottom.php'); ?>