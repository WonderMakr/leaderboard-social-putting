$(document).ready(function () {
	
	var processing = false;
	
	$('.back.button').on(event_action, function() {
	
		if (processing)
			return false;
		
		var $this = $(this);
		
		processing = true;
		$this.addClass('active');
		
		socket.emit('change-screen', {new_screen: 'go_back'});
		changeScreen('go_back');
		
	});
	
	$('#toggles > div').on(event_action, function() {
		
		if (processing)
			return false;
		
		var $this = $(this);
		
		processing = true;
		$this.addClass('active');
		
		var $current =  $('.num.current');
		var current_players = $current.text();
		
		$('.next.button').removeClass('no-cred').removeClass('active');
		$('p').removeClass('error');
		$('#error').html('');
		
		if ( (current_players == '8' && $this.hasClass('plus')) || (current_players == '0' && $this.hasClass('minus')) ) {
			setTimeout(function() {
				$this.removeClass('active');
				processing = false;
			}, 150);
			return false;
		}
		
		var change;
		var height = $('.num').css('height');
		
		if ($this.hasClass('plus')) {
			change = '-='+height;
			$current.removeClass('current').next().addClass('current');
			socket.emit('toggle-number', {direction: 'up'});
		} else {
			change = '+='+height;
			$current.removeClass('current').prev().addClass('current');
			socket.emit('toggle-number', {direction: 'down'});
		}
		
		$('#num_scroll').animate({
			marginTop: change
		}, 500, function() {
			$this.removeClass('active');
			processing = false;
		});
			
		
	});
	
	$('.next.button').on(event_action, function() {
	
		if (processing)
			return false;
		
		var $this = $(this);
		
		processing = true;
		$this.addClass('active');
		
		var $current =  $('.num.current');
		var current_players = $current.text();
		
		$this.removeClass('no-cred');
		$('#error').html('');
		
		if (current_players == '0') {
			setTimeout(function() {
				$this.removeClass('active');
				processing = false;
			}, 150);
			return false;
		}
		
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
					
					if (obj.credits == '<em>Free Play</em>' || parseInt(obj.credits) >= current_players) {
						socket.emit('change-screen', {new_screen: 'player-names?game='+game_name+'&players='+current_players});
						changeScreen("player-names?game="+game_name+"&players="+current_players);
					} else {
						$this.addClass('no-cred');
						$('p').addClass('error');
						var more_credits = current_players - parseInt(obj.credits);
						var plural = "";
						if (more_credits > 1)
							plural = "s";
						$('#error').html(' / Required Credits: '+current_players+'<br>Insert <b>'+more_credits+'</b> more credit'+plural+' to continue');
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
		
	});
	
	if (cfg_screen == 'big') {

		function toggle(direction = 'up') {
		
			var change;
			var $current = $('.num.current');
			var height = $('.num').css('height');

			if (direction == 'up') {
				change = '-='+height;
				$current.removeClass('current').next().addClass('current');
			} else {
				change = '+='+height;
				$current.removeClass('current').prev().addClass('current');
			}

			$('#num_scroll').animate({
				marginTop: change
			}, 490);

		};
		
		socket.on('toggle-number', function(msg) {
			console.log('toggling numbers: ' + msg);
			toggle(msg.direction);
		});
		
	}
	
});
