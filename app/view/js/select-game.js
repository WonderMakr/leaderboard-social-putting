$(document).ready(function () {

	if (cfg_screen == 'small') {

		$.post( "http://localhost:3030/lights", { 'attract': 'false' } );
		setTimeout(function() {
			socket.emit('change-screen', {new_screen: 'index'});
			changeScreen("index");
		}, cfg_timeout_to_attract);
		
	}
	
	var video = document.getElementById('games-video');
	video.play();
	video.onended = function() {
		video.currentTime = 0;
		video.play();
	}
	
	var processing = false;
	$('.button, .how-to').on(event_action, function() {
	
		if (processing)
			return false;
		
		processing = true;
		
		var $this = $(this);
		
		$this.addClass('active');
		
		if ($this.hasClass('back')) {
			socket.emit('change-screen', {new_screen: 'index'});
			changeScreen("index");
		} else {
			var new_screen = $this.attr('data-link');
			socket.emit('change-screen', {new_screen: new_screen});
			changeScreen(new_screen);
		}
		
	});
	
});
