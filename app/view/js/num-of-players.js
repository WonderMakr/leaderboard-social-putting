$(document).ready(function () {
	
	var processing = false;
	
	// CREDIT CARD VARIABLES ///////////
	// AND FUNCTIONS ///////////////////
	
	var creditCard = {
		number: "",
		name: "",
		date: "20"
	};
	var step = 0;
	var dateCharCounter = 0;
	var dataWipeTimer = null;
	var card_is_read = false;
	
	function chargeCard(card, send_email) {
		console.log("charge card called: ");
		
		$.post("process", {
			
			command			: "process-payment",
			name			: $('#firstname').val() + ' ' + $('#lastname').val(),
			credits			: parseInt($('.amount.current').text()),
			card_number		: card.number,
			expiration_date	: card.date
			
		}).then(function (res) {
			console.log(res);
			/*
			if (res.responseCode == 1) {
				$("#card-response").text("Successful Card Transaction!");
				$('#black-out').fadeIn(fadeTime, function() {
					window.location = "vend?product="+product+"&column="+column;
				});
			} else {
				$("#card-response").text(
					`${res.errors[0].errorText}${
					  res.errors[0].errorCode == 11
						? " Please wait 15 seconds before trying again."
						: ""
					}`
				);
			}
			*/
		});
	}
	
	function registerCardListener() {
		console.log("Card listener registered");
		
		$("html").keypress(function (msg) {
			
			if (card_is_read)
				return false;
			
			console.log("dataWipeTimer: "+dataWipeTimer);
			$('#processing #err').text('');
			$('#processing').show().addClass('working');
			$('.button.previous').css('opacity', 0);
			
			// reset all data after a specific deley (ie. 5 seconds) have the timer start on first char
			if (!dataWipeTimer) {
				dataWipeTimer = setTimeout(function () {
					creditCard = {
						number: "",
						name: "",
						date: "20"
					};

					step = 0;
					dateCharCounter = 0;
					$('#processing').removeClass('working');
					$('.button.previous').css('opacity', 1);
					$('#processing #err').text('Invalid card type. Please try again');
					dataWipeTimer = null;
					
				}, 2000);
			}

			if (
				(msg.key === "^" && step === 0)
				|| (msg.key === "^" && step === 1)
				|| (msg.key === ";" && step === 2)
				|| (msg.key === "=" && step === 3)
				|| (msg.key === "?" && step === 4)
			) {
				step++;
				return;
			}

			if (step === 1) creditCard.name = (creditCard.name + msg.key).trim();
			if (step === 3) creditCard.number = creditCard.number + msg.key;
			if (step === 4) {
				if (++dateCharCounter < 5) {
					creditCard.date =
						creditCard.date + (dateCharCounter === 3 ? "-" : "") + msg.key;
				}
			}
			if (step === 5) {
				card_is_read = true;
				console.log("credit card: ");
				console.log(creditCard);
				// Make authorize.net call here
				chargeCard(creditCard);
				clearTimeout(dataWipeTimer);
				dataWipeTimer = null;
				creditCard = {
					number: "",
					name: "",
					date: "20"
				};

				step = 0;
				dateCharCounter = 0;
			}
		});
	}
	
	////////////////////////////////////
	
	
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
		$('#error').html('<br>&nbsp;');
		
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
		$('#error').html('<br>&nbsp;');
		
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
		$('#firstname').focus();
		
	});
	
	$("#firstname, #lastname").keydown(function(event) { 
		return false;
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
		}, 300, function() {
			$this.removeClass('active');
			processing = false;
		});
			
		
	});
	
	$('#popup .cancel.button').on(event_action, function() {
		
		if ($('#processing').hasClass('working'))
			return false;
		
		var $this = $(this);
		$this.addClass('active');
		$('#purchase.button').removeClass('active');
		$('#popup').fadeOut(500, function() {
			$('body').removeClass('open-pop-up');
			$this.removeClass('active');
		});
		
	});
	
	$('#slide-scroll').width($('.slide').outerWidth()*$('.slide').length);
	
	function successfulPayment() {
		$('#slide-scroll').animate({
			marginLeft: '-='+$('#slide-scroll .slide').css('width')
		}, 500);
	}
	
	$('#purchase-buttons .button.proceed').on(event_action, function() {
		
		if (processing)
			return false;
		
		processing = true;
		
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
			$('.cAmount').text($('.amount.current').text());
			var cCharge = parseInt($('.amount.current').text()) * parseInt(cfg_credit_price);
			$('#cCharge').text('Cost: $'+cCharge);
			$('#slide-scroll').animate({
				marginLeft: '-='+$('#slide-scroll .slide').css('width')
			}, 500, function() {
				$this.hide().removeClass('active');
				processing = false;
				$('input').blur();
				registerCardListener();
				$('#purchase-buttons .button.previous').css('display','inline-block');
				// Simulate transaction 
				/*
				setTimeout(function() {
					processing_payment();
					setTimeout(function() {
						successfulPayment();
					}, 2000);
				}, 2000); */
				///////////////////////
				
			});
		} else {
			setTimeout(function() {
				processing = false;
				$this.removeClass('active');
			}, 150);
		}
		
	});
	
	$('#purchase-buttons .button.previous').on(event_action, function() {
		
		if (processing || $('#processing').hasClass('working'))
			return false;
		
		processing = true;
		
		var $this = $(this);
		$this.addClass('active');
		$('#processing').hide();
		$('#processing #err').text('');

		$('#slide-scroll').animate({
			marginLeft: '+='+$('#slide-scroll .slide').css('width')
		}, 500, function() {
			processing = false;
			$("html").off('keypress');
			$this.hide().removeClass('active');
			$('#purchase-buttons .button.proceed').css('display','inline-block');
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
