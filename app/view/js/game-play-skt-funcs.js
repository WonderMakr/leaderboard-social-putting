$(document).ready(function () {
	
	
	function tellSomeoneToPutt(name) {
		
		$('#flow-screens').addClass('putt3');
		$('#flow-screens h1').text(name);
		$('#flow-screens #putt-message').html('Putt<br><span class="lrg">3 Balls</span>');
		$('#flow-screens').fadeIn(500);
		//$('#flow-screens').append('<div id="shots"><div id="s1" class="golf-ball"></div><div id="s2" class="golf-ball"></div><div id="s3" class="golf-ball"></div></div>');
	}
	
	
	function displayScoreAndMessageWithName(name, score, message) {
		
		$('#flow-screens #putt-score').fadeOut(500);
		$('#flow-screens #putt-message').fadeOut(500, function() {
			$('#flow-screens').removeClass();
			$('#flow-screens h1').text(name);
			$('#flow-screens #putt-score').html(score+' <span>for</span> 3');
			$('#flow-screens #putt-message').html(message);
			$('#flow-screens, #putt-score, #putt-message').fadeIn(500);
		});
	}
	
	function displayScoreAndMessageWithPlayerNum(pNum, score, message) {
		
		var $player = $('.p'+pNum+'.player');
		displayScoreAndMessageWithName($player.children('.name').text(), score, message);
	}
	
	function displayGreatPuttWithName(name) {
		$('#putt-score').fadeOut(500);
		$('#flow-screens #putt-message').fadeOut(500, function() {
			$('#flow-screens').removeClass().addClass('greatShot');
			$('#flow-screens h1').text(name);
			$('#flow-screens #putt-message').addClass('b4-animate').html('<span class="lrg">Great<br>Shot!</span>').show().addClass('animate');
			$('#flow-screens').fadeIn(500);
			setTimeout(function() {
				$('#flow-screens #putt-message').removeClass('b4-animate');
			}, 500);
		});
	}
	
	function displayGreatPuttWithPlayerNum(pNum) {
		var $player = $('.p'+pNum+'.player');
		displayGreatPuttWithName($player.children('.name').text());
	}
	
	function removeUserFlowScreen() {
		$('#flow-screens').fadeOut(500, function() {
			$('#flow-screens h1').html('');
			$('#flow-screens #putt-score').html('');
			$('#flow-screens #putt-message').html('');
		});
	}
	
	/* Tests */
	if (cfg_screen == 'smalll') {
		setTimeout(function() {
			//socket.emit('game-play-alert', {func: 'removeUserFlowScreen', params : []});
			socket.emit('game-play-alert', {func: 'tellSomeoneToPutt', params : ['Andrew']});
		}, 1000);
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'removeUserFlowScreen', params : []});
		}, 3000);
		setTimeout(function() {
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithName', params : ['Andrew', '0', 'Better Luck<br>Next Time']});
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithPlayerNum', params : [1, '1', 'One is better<br>than nothing']});
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithName', params : ['Andrew', '2', "Way to go!<br>Almost Perfect"]});
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithPlayerNum', params : [2, '3', "We got a<br>pro over here!"]});
		}, 5000);
		setTimeout(function() {
			//socket.emit('game-play-alert', {func: 'displayGreatPuttWithName', params : ['Andrew']});
			socket.emit('game-play-alert', {func: 'displayGreatPuttWithPlayerNum', params : [1]});
		}, 6000);
	}
	
	
	
	
	
	var hole_colors = ['white', 'green', 'yellow', 'red'];
	
	function changeHoleColor(hole, color) {
		if (hole_colors.includes(color))
			$('#hole-'+hole).removeClass().addClass('hole '+color);
	}
	
	function changeAllHoleColors(color) {
		if (hole_colors.includes(color))
			$('.hole').removeClass().addClass('hole '+color);
	}
	
	/* Tests */ 
	if (cfg_screen == 'smalll') {
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'changeAllHoleColors', params : ['green']});
		}, 1000);
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'changeHoleColor', params : ['3', 'red']});
			socket.emit('game-play-alert', {func: 'changeHoleColor', params : ['1', 'red']});
		}, 4000);
	}
	
	
	var videos = ['fireworks', 'rocket', 'shark', 'trophy', 'wrecking-ball'];
	
    function displayWinnerWithName(videoName, winnerName) {
		
		if (!videos.includes(videoName))
			videoName = videos[Math.floor(Math.random() * videos.length)];
		
		$('#winner-is').removeClass().addClass(videoName);
		$('#winner-video source').attr('src', $('#winner-container').attr('data-vid-loc') + videoName + '.mp4');
		
		var video = document.getElementById('winner-video');
		
		video.load();
		video.onloadeddata = function() {
			$('#winner-container').fadeIn(500, function() {
				video.play();
				$('#winner-is h1').text(winnerName);
				var winner_timeout;
				switch(videoName) {
					
					case 'fireworks':
						winner_timeout = 7000;
					break;
					
					case 'rocket':
						winner_timeout = 3000;
					break;
					
					case 'shark':
					case 'trophy':
						winner_timeout = 5500;
					break;
					
					case 'wrecking-ball':
						winner_timeout = 4500;
					break;
					
					default:
						winner_timeout = 10000;
					break;
				}
				
				setTimeout(function() {
					$('#winner-is').fadeIn(1000);
				}, winner_timeout);
				
			});
		}
		
		video.onended = function() {
			console.log('Video Ended');
		};
		
	}
	
	function displayWinnerWithPlayerNum(videoName, pNum) {
		var $player = $('.p'+pNum+'.player');
		displayWinnerWithName(videoName, $player.children('.name').text());
	}
	
	/* TESTS */
	if (cfg_screen == 'small') {
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'displayWinnerWithPlayerNum', params : ['wrecking-ball', '1']});
		}, 1000);
	}
	
	
	socket.on('game-play-alert', function(msg) {

		console.log('Calling Function: ' + msg.func);
		console.log('-- With Params: ' + msg.params);
		
		switch(msg.func) {
			
			// Three parameters
			case 'displayScoreAndMessageWithName':
			case 'displayScoreAndMessageWithPlayerNum':
				console.log(msg.func +"('"+msg.params[0]+"','"+msg.params[1]+"','"+msg.params[2]+"')");
				eval(msg.func +"('"+msg.params[0]+"','"+msg.params[1]+"','"+msg.params[2]+"')");
			break;
			// Two parameters
			case 'changeHoleColor':
			case 'displayWinnerWithName':
			case 'displayWinnerWithPlayerNum':
				eval(msg.func +"('"+msg.params[0]+"','"+msg.params[1]+"')");
			break;
				
			// One Parameter
			case 'tellSomeoneToPutt':
			case 'changeAllHoleColors':
			case 'displayGreatPuttWithName':
			case 'displayGreatPuttWithPlayerNum':
				eval(msg.func +"('"+msg.params[0]+"')");
			break;
				
			// No Paramters
			case 'removeUserFlowScreen':
				eval(msg.func +"()");
			break;
				
			default:
				console.log('Function is not in switch/case block');
			break;
		}
	});
	
});
