$(document).ready(function () {
	
	if (cfg_screen == 'small') {

		$('html').on(event_action, function() {

			socket.emit('change-screen', {new_screen: 'index'});
			changeScreen("index");

		});
		
	}
	
	var video = document.getElementById('attract-video');
	video.onloadeddata = function() {
		$('#black-fade').fadeOut(cfg_fade_time, function() {
			video.play();
		});
	}
	
	var logo_transition = parseFloat($('#w-logo').css('transition-duration').replace('s', ''))*1000;
	var play_here_transitions = parseFloat($('h3.playHere > span').css('transition-duration').replace('s', ''))*1000;
	
	video.onended = function() {
		console.log('Video Ended');
		$('#w-logo').removeClass('b4-animate');
		setTimeout(function() {
			$('h3.playHere').removeClass('b4-animate');
			setTimeout(function() {
				$('h3.playHere').addClass('b4-animate');
				setTimeout(function() {
					$('#w-logo').addClass('b4-animate');
					setTimeout(function() {
						video.play();
					}, logo_transition);
				}, play_here_transitions);
			}, play_here_transitions+2500);
		}, logo_transition);
	};
	
});
