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
					
					/*if (obj.credits == 'swipe') {
						
						if (confirm('Did you pay already?', 'Yes', 'No')) {
							socket.emit('change-screen', {new_screen: 'player-names?game='+game_name+'&players='+current_players});
							changeScreen("player-names?game="+game_name+"&players="+current_players);
						} else {
							$this.addClass('no-cred');
							$('p').addClass('error');
							var money = current_players * 5;
							$('#error').html('<br>Please pay $'+money+' to play the game.');
							processing = false;
						}
						
					} else */
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
						$('#error').html(' / Required Credits: '+current_players+'<br>1 Credit is $'+cfg_credit_price);
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
	
	$('#purchase.button').on(event_action, function() {
	
		$(this).addClass('active');
		$('body').addClass('open-pop-up');
		$('#popup').fadeIn(500);
		
	});
	
	$('#cred-toggle > div').on(event_action, function() {
		
		if (processing)
			return false;
		
		var $this = $(this);
		
		processing = true;
		$this.addClass('active');
		
		var $current =  $('.amount.current');
		var current_credits = $current.text();
		
		if ( (current_credits == '8' && $this.hasClass('up')) || (current_credits == '1' && $this.hasClass('down')) ) {
			setTimeout(function() {
				$this.removeClass('active');
				processing = false;
			}, 150);
			return false;
		}
		
		var change;
		var height = $('.amount').css('height');
		
		if ($this.hasClass('up')) {
			change = '-='+height;
			$current.removeClass('current').next().addClass('current');
		} else {
			change = '+='+height;
			$current.removeClass('current').prev().addClass('current');
		}
		
		$('#cred-amount-scroll').animate({
			marginTop: change
		}, 500, function() {
			$this.removeClass('active');
			processing = false;
		});
			
		
	});
	
	$('#popup .cancel.button').on(event_action, function() {
		
		var $this = $(this);
		$this.addClass('active');
		$('#purchase.button').removeClass('active');
		$('#popup').fadeOut(500, function() {
			$('body').removeClass('open-pop-up');
			$this.removeClass('active');
		});
		
	});
	
	$('#purchase-buttons .button.proceed').on(event_action, function() {
		
		var $this = $(this); 
		$(this).addClass('active');
		$('#firstname, #lastname').removeClass('error');
		
		var firstname = $.trim($('#firstname').val());
		var lastname = $.trim($('#lastname').val());
		
		if (firstname == '')
			$('#firstname').addClass('error');
		if (lastname == '')
			$('#lastname').addClass('error');
		
		if (firstname != '' && lastname != '') {
			console.log('proceed');
			$('#fName').text(firstname);
			$('#lName').text(lastname);
			$('#cAmount').text('Credits: '+$('.amount.current').text());
			var cCharge = parseInt($('.amount.current').text()) * parseInt(cfg_credit_price);
			$('#cCharge').text('Cost: $'+cCharge);
			$('#slide-scroll').animate({
				marginLeft: '-='+$('#slide-scroll .slide').css('width')
			}, 500, function() {
				$this.hide().removeClass('active');
				$('#purchase-buttons .button.previous').css('display','inline-block');
			});
		} else {
			setTimeout(function() {
				$this.removeClass('active');
			}, 150);
		}
		
	});
	
	$('#purchase-buttons .button.previous').on(event_action, function() {
		
		var $this = $(this);
		$this.addClass('active');
		
		$('#slide-scroll').animate({
			marginLeft: '+='+$('#slide-scroll .slide').css('width')
		}, 500, function() {
			$this.hide().removeClass('active');
			$('#purchase-buttons .button.proceed').css('display','inline-block');
		});
		
	});
	
	function successPayment() {
		
		$('#slide-scroll').animate({
			marginLeft: '-='+$('#slide-scroll .slide').css('width')
		}, 500, function() {
			$('#purchase-buttons .button.previous').css('opacity',0);
		});
	}
	
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
