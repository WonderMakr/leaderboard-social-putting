$(document).ready(function () {
	
	//ANIMATIONS
	var logo_transition = parseFloat($('#w-logo').css('transition-duration').replace('s', ''))*1000;
	var play_here_transitions = parseFloat($('h3.playHere > span').css('transition-duration').replace('s', ''))*1000;
	
	setTimeout(function() {
		
		$('#w-logo').removeClass('b4-animate');
		
		setTimeout(function() {
			$('h3.playHere').removeClass('b4-animate');
			setTimeout(function() {
				$('.button').removeClass('b4-animate');
			}, play_here_transitions);
		}, logo_transition);
		
	}, cfg_fade_time+150);
	
	var processing = false;
	
	/*
	if (cfg_screen == 'small') {

		setTimeout(function() {
			socket.emit('change-screen', {new_screen: 'attract'});
			changeScreen("attract");
		}, cfg_index_timeout);
		
	} */
	
	
	if (cfg_screen == 'big') {
		
		var music = new Audio(cfg_sound_path+'high-dreams-full.wav');
		music.onended = function() {
			//playSong();
			//music.pause();
			//music.currentTime = 0;
			//music.play();
		};
		var video = document.getElementById('attract-video');
		
		function prepareAndPlayVideo() {
			music.play();
			$('#black-fade').fadeIn(cfg_fade_time, function() {
				$('h3.playHere').addClass('b4-animate');
				$('#page-content').addClass('vid-playing');
				setTimeout(function() {
					$('#black-fade').fadeOut(cfg_fade_time, function() {
						video.play();
					});
				}, play_here_transitions);
			});
			
		}
		
		setTimeout(function() {
			prepareAndPlayVideo();
		}, logo_transition+play_here_transitions+5000);
		
		video.onended = function() {
			setTimeout(function() {
				music.pause();
				music.currentTime = 0;
				$('#black-fade').fadeIn(cfg_fade_time, function() {
					$('#page-content').removeClass('vid-playing');
					$('#w-logo, h3.playHere').addClass('b4-animate');
					setTimeout(function() {
						$('#black-fade').fadeOut(cfg_fade_time, function() {
							$('#w-logo').removeClass('b4-animate');
							setTimeout(function() {
								$('h3.playHere').removeClass('b4-animate');
								setTimeout(function() {
									prepareAndPlayVideo();
								}, play_here_transitions+5000);
							}, logo_transition);
						});
					}, logo_transition);
				});
			}, 2000);
		}
	} 
	
	$('#start').on(event_action, function() {
	
		if (processing)
			return false;
		
		processing = true;
		var $this = $(this);
		
		$('#error').text('');
		$('p').removeClass('error');
		$this.removeClass('active no-cred');
		
		$this.addClass('active');
		
		setTimeout(function() {
			
			$.ajax({
				method: "POST",
				url: "process",
				data: {
					command	: 'get-credits'
				}
			}).done(function( msg ) {

				console.log(msg);
				//return false;

				try {
					var obj = $.parseJSON(msg);
					if (obj.result == 'success') {

						$('#credits').text(obj.credits);

						if (obj.credits == '<em>Free Play</em>' || obj.credits > 0 || obj.credits == 'swipe') {
							socket.emit('change-screen', {new_screen: 'select-game'});
							changeScreen("select-game");
						} else {
							$this.addClass('no-cred');
							$('p').addClass('error');
							$('#error').text('Insert credit to start');
							processing = false;
						}

					} else {
						console.log(obj);
					}

				} catch(err) {
					console.log(err);
					console.log(msg);
				}

			});
			
		}, 200);
		
	});
	
	$('#games').on(event_action, function() {
		
		if (processing)
			return false;
		
		processing = true;
		var $this = $(this);
		
		$this.addClass('active');
		socket.emit('change-screen', {new_screen: 'games-preview'});
		changeScreen("games-preview");
		
	});
	
});
