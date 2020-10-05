$(document).ready(function () {
	
	var music;
	var music_options = ['desert-biker-preview-full.mp3', 'lift-up-preview-full.mp3'];
	function playSong() {
		var music_choice = music_options[Math.floor(Math.random() * music_options.length)];
		music = new Audio(cfg_sound_path+music_choice);
		music.play();
	}
	
	/*playSong();
	music.onended = function() {
		playSong();
	};*/
	
	$('.end.button').on(event_action, function() {
		
		$('body').addClass('open-pop-up');
		$('#popup').fadeIn(500);
		
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
