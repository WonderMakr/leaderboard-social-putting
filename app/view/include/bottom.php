		<?php 
		getJS('jquery-3.5.1.min', 1);
		getJS('feathers.js', 1);
		getJS('socket.io.slim', 1);
		getJS('socket-functions', 1);
		getJS('universal?v=3.1', 1);
		if (isset($required_js)) { foreach ($required_js as $library => $external) { getJS($library, $external); } }
		if (isset($required_modal)) { foreach ($required_modal as $modal) { getModal($modal); } }
		?>
		
	</body>

</html>