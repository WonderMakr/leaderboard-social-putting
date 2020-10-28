$(document).ready(function () {
	
	var processing = false;
	
	var video1 = document.getElementById('attract-video1');
	video1.play();
	
	if (cfg_screen == 'small') {
		
		setTimeout(function() {
			$('.button').removeClass('b4-animate');
		}, 5000);

		$.post( "http://localhost:3030/lights", { 'attract': 'true' } );
		
		video1.onended = function() {
			video1.currentTime = 0;
			video1.play();
		}
	}
	
	
	if (cfg_screen == 'big') {
		
		var music = new Audio(cfg_sound_path+'play-this-game.wav');
		var video2 = document.getElementById('attract-video2');
		
		video1.onended = function() {
			$('#black-fade').fadeIn(cfg_fade_time, function() {
				$('#attract-video1').hide();
				video1.currentTime = 0;
				$('#attract-video2').show();
				$('#black-fade').fadeOut(cfg_fade_time, function() {
					music.play();
					video2.play();
				});
			});
		}
		
		video2.onended = function() {
			music.pause();
			music.currentTime = 0;
			$('#black-fade').fadeIn(cfg_fade_time, function() {
				$('#attract-video2').hide();
				video2.currentTime = 0;
				$('#attract-video1').show();
				$('#black-fade').fadeOut(cfg_fade_time, function() {
					video1.play();
				});
			});
		}
	} 
	
	$('#start').on(event_action, function() {
	
		if (processing)
			return false;
		
		processing = true;
		var $this = $(this);
		
		$this.addClass('active');
		
		socket.emit('change-screen', {new_screen: 'select-game'});
		changeScreen("select-game");

		/*
		NOT CHECKING FOR CREDITS AT START PAGE ANYMORE
		
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

						$('#credits').html(obj.credits);

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
		*/
		
	});
	
	$('#games').on(event_action, function() {
		
		if (processing || $(this).hasClass('freeplay'))
			return false;
		
		processing = true;
		var $this = $(this);
		
		$this.addClass('active');
		socket.emit('change-screen', {new_screen: 'games-preview'});
		changeScreen("games-preview");
		
	});
	
});
