$(document).ready(function () {
	
	var video = document.getElementById('lines-video');
	video.play();
	video.onended = function() {
		video.currentTime = 0;
		video.play();
	}
		
	var points = $('ol li');

	for (var p = 0; p < points.length; p++) {

		var delay = p*1800;
		animatePoints(points[p], delay);
	}

	function animatePoints(point, delay) {

		setTimeout(function() {
			$(point).removeClass('b4-animate');
		}, delay);
	}
	
	$('.button').on(event_action, function() {
	
		var $this = $(this);
		
		$this.addClass('active');
		socket.emit('change-screen', {new_screen: 'go_back'});
		changeScreen('go_back');
		
	});
	
	if (cfg_screen == 'small') {
		setTimeout(function() {
			socket.emit('change-screen', {new_screen: 'index'});
			changeScreen("index");
		}, cfg_timeout_to_attract);
	}
	
});
