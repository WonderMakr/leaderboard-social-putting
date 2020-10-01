$(document).ready(function () {
	
	$('.end.button').on(event_action, function() {
		
		$('body').addClass('open-pop-up');
		$('#popup').fadeIn(500);
		
	});
	
	$('#popup .clear.button').on(event_action, function() {
		
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

					socket.emit('change-screen', {new_screen: 'index'});
					window.location = "index";
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
	
	///////////////////////
	/* AVAILABLE SCREENS */
	//
	// putt3
	// shots-0-3
	// great-shot
	//
	///////////////////////
	
	function displayUserFlowScreenWithName(screen, name) {
		$('#flow-screens h1').text(name);
		$('#flow-screens').addClass(screen).fadeIn(400);
	}
	
	function displayUserFlowScreenPlayerNum(screen, pNum) {
		
		var $player = $('.p'+pNum+'.player');
		displayUserFlowScreenWithName(screen, $player.children('.name').text());
	}
	
	function removeUserFlowScreen() {
		$('#flow-screens').fadeOut(400, function() {
			$('#flow-screens h1').text('');
		});
	}
	
	/* Tests */
	//setTimeout(function() {displayUserFlowScreenPlayerNum('putt3', 1)}, 1000);
	
	//setTimeout(function() {removeUserFlowScreen()}, 3000);
	
	
	
	//////////////////////
	/* AVAILABLE COLORS */
	//
	// white
	// green
	// yellow
	// red
	//
	//////////////////////
	
	function changeHoleColor(hole, color) {
		$('#hole-'+hole).removeClass().addClass('hole '+color);
	}
	
	function changeAllHoleColor(color) {
		$('.hole').removeClass().addClass('hole '+color);
	}
	
	/* Tests */ 
	/*
	setTimeout(function() {
		changeHoleColor(1,'green');
		changeHoleColor(2,'yellow');
		changeHoleColor(3,'red');
	}, 1000);
	
	setTimeout(function() {
		changeAllHoleColor('red');
	}, 3000);
	*/
	
	
	
	//////////////////////
	/* AVAILABLE VIDEOS */
	//
	// random
	// fireworks
	// rocket
	// shark
	// trophy
	// wrecking-ball	
	//
	//////////////////////
	
	var videos = ['fireworks', 'rocket', 'shark', 'trophy', 'wrecking-ball'];
	
    function displayWinnerWithName(videoName, winnerName) {
		
		if (videos.indexOf(videoName) < 0)
			videoName = videos[Math.floor(Math.random() * videos.length)];
		
		$('#winner-video source').attr('src', $('#winner-container').attr('data-vid-loc') + videoName + '.mp4');
		
		var video = document.getElementById('winner-video');
		
		video.load();
		video.onloadeddata = function() {
			$('#winner-container').fadeIn(500, function() {
				video.play();
			});
		}
		
		video.onended = function() {
			console.log('Video Ended');
			$('#winner-is').fadeIn(500);
		};
		
	}
	
	function displayWinnerWithPlayerNum(videoName, pNum) {
		var $player = $('.p'+pNum+'.player');
		displayWinnerWithName(videoName, $player.children('.name').text());
	}
	
	/* TESTS */
	//displayWinnerWithPlayerNum('rand', 2);
	
});
