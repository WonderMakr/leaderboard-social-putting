var currentGame = {};

$(document).ready(function () {
	// displayGreatPuttWithPlayerNum(1);

	// setTimeout(removeUserFlowScreen, 2000)

	

	
	/* Tests
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
			socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithName', params : ['Andrew', '2', "Way to go!<br>Almost Perfect"]});
			//socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithPlayerNum', params : [2, '3', "We got a<br>pro over here!"]});
		}, 5000);
		setTimeout(function() {
			//socket.emit('game-play-alert', {func: 'displayGreatPuttWithName', params : ['Andrew']});
			socket.emit('game-play-alert', {func: 'displayGreatPuttWithPlayerNum', params : [1]});
		}, 7000);
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'removeUserFlowScreen', params : []});
		}, 9000);
	}
	*/
	
	
	/* TESTS 
	if (cfg_screen == 'smalll') {
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'displayWinnerWithPlayerNum', params : ['rocket', '1']});
		}, 1000);
	}
	*/
	
	/*
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
	*/

	main();
	
});

const main = async () => {
	await startGame();

	app.service('games').on('patched', async function (game) {
		console.log(game);
		if (game.players.length) {
			game.players.forEach(player => {
				$(`#p${player.id} > .score`).html(`${player.score}`);
			});
		}
		// document.getElementById('game-info').innerHTML = `Current Game: ${JSON.stringify(game, undefined, 2)}`;

		if (!game.length && game.status === "in_progress" && game.current_player_id) {
			updateCurrentPlayer(game.current_player_id);
		} else if (!game.length && game.status === "completed" && game.winner_id) {
			// document.getElementById('game-info').innerHTML = `Current Game:`;

			await updateWinner(game.winner_id);
			setTimeout(function () {
				// document.getElementById('current-player').innerHTML = `Current Player:`;
			}, 10000);
		}

		// This logic needs to be corrected for a single player
		// Check if the player just putted
		if (currentGame.id === undefined || (game.current_player_id !== currentGame.current_player_id)) {
			let multiplier = 1;
			// New player turn
			if (currentGame.id) {
				// The very first person has already putted
				multiplier = 2;
				displayScoreAndMessageWithPlayerId(currentGame.current_player_id, 0, "Cool!");
			}

			if (multiplier === 2) {
				setTimeout(removeUserFlowScreen, 2000);
			}

			setTimeout(function() {
				tellSomeoneToPuttWithPlayerId(game.current_player_id);
			}, (multiplier-1)*4000);

			setTimeout(removeUserFlowScreen, multiplier*4000);
		}
		

		currentGame = game;
	});

	app.service('holes').on('patched', function (hole) {
		// This may come back as an array on a multi patch
		console.log(hole);

		if (!hole.length && hole.id) {
			if (hole.active) changeHoleColor(hole.id, 'white');
			if (!hole.active) changeHoleColor(hole.id, 'green');
		} else if (hole.length && hole[0].id) {
			hole.forEach(function(holeData) {
				if (holeData.active) changeHoleColor(holeData.id, 'white');
				if (!holeData.active) changeHoleColor(holeData.id, 'green');
			})
		}
	});

	app.service('putts').on('created', function (putt) {
		// This may come back as an array on a multi patch
		// console.log(hole);
		if (putt.success) {
			//displayGreatPuttWithPlayerId(putt.player_id);
			//setTimeout(removeUserFlowScreen, 2000);
		}
	});

	app.service('game-data').on('patched', function (gameData) {
		// console.log(gameData);
		// updateCredits(gameData.credits);
	});
};

/******* ALL HELPER FUNCTIONS ********/

// Starts golf game on server (work out a cleaner solution)
async function startGame() {
	const gameInProgress = await app.service('games').find({
		query: {
			status: 1,
			current_player_id: 0,
			$limit: 1,
		}
	});
	console.log(gameInProgress);
	if (gameInProgress.length) {
		let game = gameInProgress[0];
		await app.service('games').patch(game.id, {
			status: 1
		});
	} else {
		console.log("Sorry, there is no game available to start.");
	}
}

// End all games
async function endGames() {
	await app.service('games').patch(null, {
		status: 2
	}, {
		query: {
			status: 1
		}
	});
}

// Update current player
async function updateCurrentPlayer(playerId) {
	// console.log("Update Current Player to ID: ", playerId);
	const currentPlayer = (await app.service('players').get(playerId)).name;
	$(".player").removeClass("current");
	$(`#p${playerId}`).addClass("current");
	// document.getElementById('current-player').innerHTML = `Current Player: ${currentPlayer}`;
}

async function updateWinner(playerId) {
	// const currentPlayer = await app.service('players').get(playerId);
	displayWinnerWithPlayerId("rocket", playerId);
	/*
	$(`#p${playerId} > .score`).html(`WINNER`);
	setTimeout(function () {
		window.location = 'index';
	}, 5000)
	*/
	// document.getElementById('current-player').innerHTML = `WINNER: ${currentPlayer.name} (${currentPlayer.score} Points)`;
}

async function getCurrentPlayerIndex() {
	let lastPlayerId = currentGame.players[currentGame.player_count - 1].id;
	let currentAndLastPlayerDifference = lastPlayerId - currentGame.current_player_id;
	let currentPlayerIndex = (currentGame.player_count - 1) - currentAndLastPlayerDifference;
	return currentPlayerIndex;
  }

/***** Andrew functions	****/
	// Runs at beginning of someones turn
	function tellSomeoneToPutt(name) {
		
		$('#flow-screens').addClass('putt3');
		$('#flow-screens h1').text(name);
		$('#flow-screens #putt-message').html('Putt<br><span class="lrg">3 Balls</span>');
		$('#flow-screens').fadeIn(500);
		//$('#flow-screens').append('<div id="shots"><div id="s1" class="golf-ball"></div><div id="s2" class="golf-ball"></div><div id="s3" class="golf-ball"></div></div>');
	}

	// Calls tellSomeoneToPutt using the player ID
	function tellSomeoneToPuttWithPlayerId(pId) {
		var $player = $('#p'+pId);
		tellSomeoneToPutt($player.children('.name').text());
	}
	
	// # for 3 and a randomized message (runs at the end of a player's turn)
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
	
	// Calls displayScoreAndMessageWithName using the player number
	function displayScoreAndMessageWithPlayerNum(pNum, score, message) {
		
		var $player = $('.p'+pNum+'.player');
		displayScoreAndMessageWithName($player.children('.name').text(), score, message);
	}

	// Calls displayScoreAndMessageWithName using the player ID
	function displayScoreAndMessageWithPlayerId(pId, score, message) {
		
		var $player = $('#p'+pId);
		displayScoreAndMessageWithName($player.children('.name').text(), score, message);
	}
	
	// Display after a successful putt
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
	
	// Calls displayGreatPuttWithName using player number
	function displayGreatPuttWithPlayerNum(pNum) {
		var $player = $('.p'+pNum+'.player');
		displayGreatPuttWithName($player.children('.name').text());
	}

	// Calls displayGreatPuttWithName using player ID
	function displayGreatPuttWithPlayerId(pId) {
		var $player = $('#p'+pId);
		displayGreatPuttWithName($player.children('.name').text());
	}
	
	// Hides the interstitial screen
	function removeUserFlowScreen() {
		$('#flow-screens').fadeOut(500, function() {
			$('#flow-screens h1').html('');
			$('#flow-screens #putt-score').html('');
			$('#flow-screens #putt-message').html('');
		});
	}

	var hole_colors = ['white', 'green', 'yellow', 'red', 'blue'];
	
	function changeHoleColor(hole, color) {
		if (hole_colors.includes(color))
			$('#hole-'+hole).removeClass().addClass('hole '+color);
	}
	
	function changeAllHoleColors(color) {
		if (hole_colors.includes(color))
			$('.hole').removeClass().addClass('hole '+color);
	}
	
	/* Tests 
	if (cfg_screen == 'smalll') {
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'changeAllHoleColors', params : ['green']});
		}, 1000);
		setTimeout(function() {
			socket.emit('game-play-alert', {func: 'changeHoleColor', params : ['3', 'red']});
			socket.emit('game-play-alert', {func: 'changeHoleColor', params : ['1', 'red']});
		}, 4000);
	}
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
			if (cfg_screen == 'small') {
				console.log('finished');
							
				$('#popup #p-content h1').text('Great Game');
				$('#popup #p-content p').html('Thank you for playing.<br>We hope to see you again soon!');
				$('#popup #p-content .button.cancel').remove();
				$('#winner-container').fadeOut(1000, function() {
					$('body').addClass('open-pop-up');
					$('#popup').fadeIn(500);
				});
				/*
				$.ajax({
					method: "POST",
					url: "process",
					data: {
						command		: 'complete-game',
						game_id		: current_game_id
					}
				}).done(function( msg ) {

					console.log(msg);
					//return false;

					try {

						var obj = $.parseJSON(msg);

						if (obj.result == 'success') {
							
							console.log('finished');
							
							$('#popup #p-content h1').text('Great Game');
							$('#popup #p-content p').html('Thank you for playing.<br>We hope to see you again soon!');
							$('#popup #p-content .button.cancel').remove();
							$('#winner-container').fadeOut(1000, function() {
								$('body').addClass('open-pop-up');
								$('#popup').fadeIn(500);
							});
							
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
				*/
			}
		};
		
	}
	
	function displayWinnerWithPlayerNum(videoName, pNum) {
		var $player = $('.p'+pNum+'.player');
		displayWinnerWithName(videoName, $player.children('.name').text());
	}

	function displayWinnerWithPlayerId(videoName, pId) {
		var $player = $('#p'+pId);
		displayWinnerWithName(videoName, $player.children('.name').text());
	}