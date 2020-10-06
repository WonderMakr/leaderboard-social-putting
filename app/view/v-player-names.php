<?php include ('include/top.php'); ?>

<script>
	var game_name = '<?php echo $game_name; ?>';
	var num_of_players = <?php echo $num_of_players; ?>;
	var char_limit = <?php echo $cfg['name_char_limit']; ?>;
</script>

<div id="page-content" class="w30-w70">
	
	<div class="w30">
		<div id="header"><img id="g-logo" src="<?php echo $cfg['img_path']; ?>logo-green.jpg" /></div>
		<img id="game-img" src="<?php echo $cfg['img_path'].$game_name; ?>.png" />
	</div>
	
	<div class="w70">
		
		<h3>Enter Player #<span id="play_num">1</span> Name</h3>
		
		<?php if ($screen == 'small') : ?>
		
		<h4>Max <?php echo $cfg['name_char_limit']; ?> Characters</h4>
		
		<div class="input">
			<input type="text" id="player" maxlength="10" />
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