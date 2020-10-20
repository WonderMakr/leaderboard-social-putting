		<?php 
		if ($screen == 'small') {
		
			$spc_pg_msg = array("index", "games-preview", "select-game", "game-instructions", "num-of-players", "player-names");
			
			if (in_array($page, $spc_pg_msg) && unitName() == 'Bingemans')
				echo '<div id="special_message">'.$lang_special_message.'</div>';
		
		}
		?>	
	
		<?php 
		getJS('jquery-3.5.1.min', 1);
		getJS('feathers', 1);
		getJS('socket.io.slim', 1);
		getJS('socket-functions', 1);
		getJS('universal?v=3.1', 1);
		if (isset($required_js)) { foreach ($required_js as $library => $external) { getJS($library, $external); } }
		if (isset($required_modal)) { foreach ($required_modal as $modal) { getModal($modal); } }
		?>
		
	</body>

</html>