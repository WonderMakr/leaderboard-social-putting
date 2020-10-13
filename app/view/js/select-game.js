$(document).ready(function () {

	$.post( "http://localhost:3030/lights", { 'attract': 'false' } );
	
	if (cfg_screen == 'big') {
		
		var balls = $('.golf-ball');
		var putt = new Audio(cfg_sound_path+'golf-putt-sound.mp3');
		var ball_transition = parseFloat($('.golf-ball').css('transition-duration').replace('s', ''))*1000;

		for (var b = 0; b < balls.length; b++) {
			//console.log(b);
			var delay = balls.length - b;
			animateBall(balls[b], delay*1000, ball_transition);
		}
		
		function animateBall(ball, delay, reveal_game_delay) {
			//console.log(ball);
			setTimeout(function() {
				
				putt.pause();
				putt.currentTime = 0;
				putt.play();
				$(ball).removeClass('b4-animate');
				setTimeout(function() {
					$(ball).addClass('after-animate');
					$(ball).children('img').removeClass('b4-animate');
				}, reveal_game_delay);
				
			}, delay);
			
		}
		
	} else {
		setTimeout(function() {
			socket.emit('change-screen', {new_screen: 'index'});
			changeScreen("index");
		}, cfg_timeout_to_attract);
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
