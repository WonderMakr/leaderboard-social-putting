$(document).ready(function () {
	
	var processing = false;
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
							window.location = "select-game";
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
		window.location = "games-preview";
		
	});
	
});
