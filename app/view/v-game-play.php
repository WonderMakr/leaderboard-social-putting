<?php include ('include/top.php'); ?>
<?php include('include/endgame-popup.php'); ?>

<script>
	var current_game_id = <?php echo $current_game['id']; ?>
</script>

<div id="winner-container" data-vid-loc="<?php echo $cfg['vid_path']; ?>">
	<div id="winner-is">
		<h1></h1>
		<h2>Is The</h2>
	</div>
	<video id="winner-video"><source src="<?php echo $cfg['vid_path']; ?>fireworks.mp4" type="video/mp4"></video>
</div>

<div id="page-content">

	<div id="header">
		<img id="logo" src="<?php echo $cfg['img_path']; ?>logo-score.png" />
		<img id="game-img" src="<?php echo $cfg['img_path'].$game_name; ?>.png" />
	</div>
	
	<div id="content">
		
		<div id="flow-screens">
			<h1></h1>
		</div>
		
		<div id="players">
			
			<div id="player-conainer">

				<?php foreach ($players as $p => $player) : ?>

				<div id="p<?php echo $player['id']; ?>" class="p<?php echo $p+1; ?> player<?php echo $p == 0 ? ' current' : ''; ?>">
					<div class="num"><?php echo $p+1; ?></div>
					<div class="name"><?php echo $player['name']; ?></div>
					<div class="score"><?php echo $player['score']; ?></div>
				</div>

				<?php endforeach; ?>
		
				<?php /* for ($p=0; $p<8; $p++) : ?>

				<div id="p<?php echo $p; ?>" class="p<?php echo $p+1; ?> player<?php echo $p == 0 ? ' current' : ''; ?>">
					<div class="num"><?php echo $p+1; ?></div>
					<div class="name"><?php echo "drew"; ?></div>
					<div class="score">0</div>
				</div>

				<?php endfor; */ ?>
				
			</div>
			
			<?php if ($screen == 'small') : ?>
			<div id="buttons">
				<div class="success button">Successful Putt</div>
				<div class="end button">End Game</div>
			</div>
			<?php endif; ?>
			
		</div>
		
		<div id="board">
			
			<img id="game-board" src="<?php echo $cfg['img_path']; ?>board.jpg" />
			<?php for ($h=1; $h<7; $h++) : ?>
			<div id="hole-<?php echo $h; ?>" class="hole white" style="-webkit-mask-image: url('<?php echo $cfg['img_path']; ?>masks/hole-<?php echo $h; ?>.png');"></div>
			<?php endfor; ?>
			
		</div>
		
	</div>
	
</div>

<?php include ('include/bottom.php'); ?>