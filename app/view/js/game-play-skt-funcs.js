$(document).ready(function () {
	
	
	function tellSomeoneToPutt(name) {
		
		$('#flow-screens').addClass('putt3');
		$('#flow-screens h1').text(name);
		$('#flow-screens #putt-message').html('Putt<br><span class="lrg">3 Balls</span>');
		$('#flow-screens').fadeIn(500);
	}
	
	
	function displayScoreAndMessageWithName(name, score, message) {
		
		$('#flow-screens #putt-score').fadeOut(500);
		$('#flow-screens #putt-message').fadeOut(400, function() {
			$('#flow-screens').removeClass();
			$('#flow-screens h1').text(name);
			$('#flow-screens #putt-score').html(score+' <span>for</span> 3');
			$('#flow-screens #putt-message').html(message);
			$('#putt-score, #putt-message').fadeIn(500);
		});
	}
	
	function displayScoreAndMessageWithPlayerNum(pNum, score, message) {
		
		var $player = $('.p'+pNum+'.player');
		displayScoreAndMessageWithName($player.children('.name').text(), score, message);
	}
	
	function removeUserFlowScreen() {
		$('#flow-screens').fadeOut(500, function() {
			$('#flow-screens h1').html('');
			$('#flow-screens #putt-score').html('');
			$('#flow-screens #putt-message').html('');
		});
	}
	
	/* Tests */
	if (cfg_screen == 'small') {
		setTimeout(function() {
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithName', params : ['Andrew', '0', 'Better Luck<br>Next Time']});
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithPlayerNum', params : [1, '1', 'One is better<br>than nothing']});
			socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithName', params : ['Andrew', '2', "Way to go!<br>Almost Perfect"]});
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithPlayerNum', params : [2, '3', "We got a<br>pro over here!"]});
		}, 5000);
		setTimeout(function() {
			//socket.emit('game-play-alert', {func: 'removeUserFlowScreen', params : []});
			socket.emit('game-play-alert', {func: 'tellSomeoneToPutt', params : ['Andrew']});
		}, 1000);
	}
	//setTimeout(function() {displayScoreAndMessageWithName('putt3', 'Andrew')}, 1000);
	//setTimeout(function() {displayScoreAndMessageWithPlayerNum('putt3', 1)}, 1000);
	//setTimeout(function() {removeUserFlowScreen()}, 3000);
	
	
	
	
	
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
	/*
	setTimeout(function() {
		changeHoleColor(1,'green');
		changeHoleColor(2,'yellow');
		changeHoleColor(3,'red');
	}, 1000);
	
	setTimeout(function() {
		changeAllHoleColors('red');
	}, 3000);
	*/
	
	
	
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
			});
		}
		
		video.onended = function() {
			console.log('Video Ended');
			$('#winner-is h1').text(winnerName);
			$('#winner-is').fadeIn(500);
		};
		
	}
	
	function displayWinnerWithPlayerNum(videoName, pNum) {
		var $player = $('.p'+pNum+'.player');
		displayWinnerWithName(videoName, $player.children('.name').text());
	}
	
	/* TESTS */
	if (cfg_screen == 'smalll') {
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'displayWinnerWithPlayerNum', params : ['wrecking-ball', '1']});
		}, 2000);
	}
	//displayWinnerWithPlayerNum('rand', 2);
	
	
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
