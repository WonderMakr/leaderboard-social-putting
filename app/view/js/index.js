$(document).ready(function () {
	
	//ANIMATIONS
	setTimeout(function() {
		
		var logo_transition = parseFloat($('#w-logo').css('transition-duration').replace('s', ''))*1000;
		var play_here_transitions = parseFloat($('h3.playHere > span').css('transition-duration').replace('s', ''))*1000;
		
		$('#w-logo').removeClass('b4-animate');
		
		setTimeout(function() {
			$('h3.playHere').removeClass('b4-animate');
			setTimeout(function() {
				$('.button').removeClass('b4-animate');
			}, play_here_transitions);
		}, logo_transition);
		
	}, cfg_fade_time+150);
	
	var processing = false;
	
	if (cfg_screen == 'small') {

		setTimeout(function() {
			socket.emit('change-screen', {new_screen: 'attract'});
			changeScreen("attract");
		}, cfg_index_timeout);
		
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

						if (obj.credits == '<em>Free Play</em>' || obj.credits > 0) {
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
