$(document).ready(function () {
	
	var music;
	var music_options = ['desert-biker-preview-full.mp3', 'lift-up-preview-full.mp3'];
	function playSong() {
		var music_choice = music_options[Math.floor(Math.random() * music_options.length)];
		music = new Audio(cfg_sound_path+music_choice);
		music.play();
	}
	
	if (cfg_screen == 'big') {
		playSong();
		music.onended = function() {
			playSong();
		};
	}
	
	$('.end.button').on(event_action, function() {
		
		$(this).addClass('active');
		$('#p-content h1').text('End Game?');
		$('#p-content p').html($('#end-game').clone());
		$('.cancel.button').text('Close');
		$('.clear.button, .new_game.button').show();
		$('body').addClass('open-pop-up');
		$('#popup').fadeIn(500);
		
	});
	
	function openInstructions() {
		$(this).addClass('active');
		$('#p-content h1').text('Instructions');
		$('#p-content p').html($('#instructions-points').clone());
		$('.cancel.button').text('Close');
		$('.clear.button, .new_game.button').hide();
		$('body').addClass('open-pop-up');
		$('#popup').fadeIn(500);
	}
	
	$('.instructions.button').on(event_action, function() {
		socket.emit('popup', {popup: 'instructions', action: 'open'});
		openInstructions();	
	});
	
	socket.on('popup', function(msg) {
	
		if (msg.popup == 'instructions') {
			
			if (msg.action == 'open')
				openInstructions();
			else if (msg.action == 'close')
				$('.cancel.button').trigger(event_action);
		}
		
	});
	
	$('#popup .cancel.button').on(event_action, function() {
		
		var $this = $(this);
		$this.addClass('active');
		$('.end.button').removeClass('active');
		$('.instructions.button').removeClass('active');
		if (cfg_screen == 'small')
			socket.emit('popup', {popup: 'instructions', action: 'close'});
		$('#popup').fadeOut(500, function() {
			$('body').removeClass('open-pop-up');
			$this.removeClass('active');
		});
		
	});
	
	var processing = false;
	
	$('#popup .clear.button, #popup .new_game.button').on(event_action, function() {
		
		if (processing)
			return false;
		
		processing = true;
		
		$(this).addClass('active');
		
		var next_screen = 'index';
		if ($(this).hasClass('new_game'))
			next_screen = 'select-game';
		
		$.ajax({
			method: "POST",
			url: "process",
			data: {
				command		: 'end-clear-game',
				game_id		: current_game_id
			}
		}).done(function( msg ) {

			console.log(msg);
			//return false;

			try {
				
				var obj = $.parseJSON(msg);

				if (obj.result == 'success') {

					socket.emit('change-screen', {new_screen: next_screen});
					window.location = next_screen;
					return false;

				} else {
					console.log(obj);
					alert(obj.message);
				}

			} catch(err) {
				console.log(err);
				console.log(msg);
			}

		});
		
	});
	
});
