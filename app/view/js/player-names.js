$(document).ready(function () {
	
	var player_names = [];
	
	$('#player').focus();
	
	var processing = false;
	
	$('.back.button').on(event_action, function() {
	
		if (processing)
			return false;
		
		var $this = $(this);
		
		processing = true;
		$this.addClass('active');
		
		socket.emit('change-screen', {new_screen: 'go_back'});
		history.back();
		
	});
	
	var player_names = [];
	$('.next.button').on(event_action, function() {
	
		if (processing)
			return false;
		
		$('#name_error').text('');
		var $this = $(this);
		
		processing = true;
		$this.addClass('active');
		
		setTimeout(function() {
			
			if ($this.text() == 'Complete') {
				
				$.ajax({
					method: "POST",
					url: "process",
					data: {
						command		: 'start-game',
						names		: player_names,
						game		: game_name
					}
				}).done(function( msg ) {

					console.log(msg);
					//return false;

					try {
						var obj = $.parseJSON(msg);

						if (obj.result == 'success') {

							socket.emit('change-screen', {new_screen: 'game-play'});
							window.location = "game-play";
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
				
			} else {
			
				var player_name = $('#player').val().trim();
		
				if (player_name.length < 1)
					$('#name_error').text('Please enter a name');

				else if (player_name.length > char_limit)
					$('#name_error').text('Too many characters');

				else {

					player_names.push(player_name);
					$('#player').val('');
					socket.emit('add-name', {name: player_name, status: 'next'});

					if (parseInt($('#play_num').text()) == num_of_players) {

						$('h3, h4, .input, #keyboard-container').css('opacity', 0.25);
						$('.next.button').removeClass('next').addClass('complete').text('Complete');

					} else {

						$('#play_num').text(parseInt($('#play_num').text())+1);
					}


				}

				$this.removeClass('active');
				processing = false;
				setTimeout(function() {
					$('#player').focus();
				}, 100);
				
			}
			
		}, 150);
		
	});
	
	
	if (cfg_screen == 'big') {
		var player_number = 1;
		function add_name(name, status = 'next') {
		
			$('#pl'+player_number+' .name').text(name).fadeIn(500);
			
			player_number++;
			$('#play_num').text(parseInt($('#play_num').text())+1);
			
			if (status == 'complete') {
				setTimeout(function() {
					window.location = "game-play";
				}, 1500);
			}

		}

		socket.on('add-name', function(msg) {
			console.log('Adding Name: ' + msg.name);
			add_name(msg.name, msg.status);
		});
		
	}
	
});
