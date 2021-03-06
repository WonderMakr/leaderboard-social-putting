var currentGame = {};
var music;
var videos = ['fireworks', 'rocket', 'shark', 'trophy', 'wrecking-ball'];
var hole_colors = ['white', 'green', 'yellow', 'red', 'blue'];
var game_play_songs = music_options.slice(0);
// var setOnce = 0;

var flowscreen_fadetime = 750;

function playSong() {
  if (game_play_songs.length == 0) game_play_songs = music_options.slice(0);

  var randID = Math.floor(Math.random() * game_play_songs.length);

  var music_choice = game_play_songs[randID];

  console.log('Playing: ' + music_choice);

  music = new Audio(cfg_sound_path + 'game-play/' + music_choice);
  music.volume = cfg_game_play_volume;
  music.play();
  music.onended = function() {
    playSong();
  };

  game_play_songs.splice(randID, 1);
}

if (cfg_screen == 'big') playSong();

setTimeout(function() {
  //displayWinnerWithPlayerNum('trophy', 1);
  //displayScoreAndMessageWithPlayerNum(1, 1, 'One is better<br>than nothing');
  //displayGreatPuttWithPlayerNum(1);
}, 1000);

$(document).ready(function() {
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

  app.service('games').on('patched', async function(game) {
    console.log('GAME UPDATE');
    // if (!setOnce++) game.current_player_id = 0; // make this only happen on the first go around
    console.log(game);
    $('#c_round').html(game.current_round);
    if (game.game_type_id === 3 || game.game_type_id === 2)
      $('#round-info:visible').hide(); // Make this only happen once

    let currentPlayerChanged = game.current_player_id !== currentGame.current_player_id;
    let currentRoundChanged = game.current_round !== currentGame.current_round;
    let currentPlayerOrRoundChanged = currentPlayerChanged || currentRoundChanged;
    let isGame3With1Player = currentGame.game_type_id === 3 && currentGame.player_count === 1;

    if (game.players.length) {
      game.players.forEach(player => {
        if (game.game_type_id === 3) {
          let currentPlayerActiveHole =
            0.5 * (Math.sqrt(8 * player.score + 1) - 1) + 1; // This equations is generated from solving for n in the series 0+1+2+...
          $(`#p${player.id} > .score`).html(`${currentPlayerActiveHole < 7 ? currentPlayerActiveHole : 6} of 6`);
        } else {
          $(`#p${player.id} > .score`).html(`${player.score}`);
        }
      });
    }
    // document.getElementById('game-info').innerHTML = `Current Game: ${JSON.stringify(game, undefined, 2)}`;

    if (
      !game.length &&
      game.status === 'in_progress' &&
      game.current_player_id
    ) {
      updateCurrentPlayer(game.current_player_id);
    } else if (!game.length && game.status === 'completed' && game.winner_id) {
      // document.getElementById('game-info').innerHTML = `Current Game:`;
      await updateWinner(game.winner_id);
    }

    // This logic needs to be corrected for a single player
    // Check if the player just putted
    // This also gets triggered if currentGame.current_player_id == 0 and never gets set to the actual current game data
    if (currentPlayerOrRoundChanged && currentGame.current_player_id && !isGame3With1Player) {
      let multiplier = 1;
      // New player turn
      if (currentGame.game_type_id != 3) {
        // Also need to consider the fact that game type 3 is going to have logic that allows for less than 3 balls per turn
        // use the "ball" number on the most recent putt to determine this
        // The very first person has already putted
        multiplier = 2;
        console.log('currentGame');
        console.log(currentGame);
        let currentPlayerPutts =
          currentGame.players[getCurrentPlayerIndex()].putts;
        let sumOfLastThreePutts =
          currentPlayerPutts[currentPlayerPutts.length - 1].success +
          currentPlayerPutts[currentPlayerPutts.length - 2].success +
          currentPlayerPutts[currentPlayerPutts.length - 3].success;
        let messageArray = [
			lang_better_luck,
			lang_better_than_none,
			lang_almost_perfect,
			lang_got_a_pro
        ];
        displayScoreAndMessageWithPlayerId(
          currentGame.current_player_id,
          sumOfLastThreePutts,
          messageArray[sumOfLastThreePutts]
        );
      }

      if (multiplier === 2) {
        setTimeout(removeUserFlowScreen, 2000);
      }

      // Don't love this, but it's a quick fix for now
      if (currentGame.game_type_id === 3) multiplier = 2;

      setTimeout(function() {
        tellSomeoneToPuttWithPlayerId(game.current_player_id);
      }, (multiplier - 1) * 4000);

      setTimeout(removeUserFlowScreen, multiplier * 4000);
    }

    currentGame = game;
  });

  app.service('holes').on('patched', function(hole) {
    // This may come back as an array on a multi patch
    console.log('HOLE UPDATE');
    console.log(hole);

    if (!hole.length && hole.id) {
      changeHoleColor(hole.id, hole.color);
    } else if (hole.length && hole[0].id) {
      hole.forEach(function(holeData) {
        changeHoleColor(holeData.id, hole.color);
      });
    }
  });

  app.service('putts').on('created', function(putt) {
    // This may come back as an array on a multi patch
    console.log('NEW PUTT');
    console.log(putt);

    let isGame1or2 = currentGame.game_type_id === 1 || currentGame.game_type_id === 2;
    let currentHoleIsNotCurrentPlayerScore = putt.hole_id !== getCurrentPlayerScore();
    let isGame3 = currentGame.game_type_id === 3;
    let currentPlayerScoreIsNot15 = getCurrentPlayerScore() != 15; // This means they are on last putt

    // Game 1 still has this message being shown on the third ball somehow?
    // Alice said this at one point. It might not be the case.
    if (
      putt.success &&
      (putt.ball !== 3 || isGame3) &&
      ((isGame1or2 &&
        currentHoleIsNotCurrentPlayerScore) ||
        (isGame3 && currentPlayerScoreIsNot15))
    ) {
      displayGreatPuttWithPlayerId(putt.player_id);
      setTimeout(removeUserFlowScreen, 2000);
    }
  });

  app.service('game-data').on('patched', function(gameData) {
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
      $limit: 1
    }
  });
  console.log('START GAME');
  console.log(gameInProgress);

  // Call on small screen so it only happens once
  if (cfg_screen == 'small') {
    if (gameInProgress.length) {
      let game = gameInProgress[0];
      await app.service('games').patch(game.id, {
        status: 1
      });
    } else {
      console.log('Sorry, there is no game available to start.');
    }
  }

  // Only for the first player at the beginning of a game
  tellSomeoneToPuttWithPlayerNum(1);

  setTimeout(removeUserFlowScreen, 4000);
}

// End all games
async function endGames() {
  await app.service('games').patch(
    null,
    {
      status: 2
    },
    {
      query: {
        status: 1
      }
    }
  );
}

// Update current player
async function updateCurrentPlayer(playerId) {
  // console.log("Update Current Player to ID: ", playerId);
  const currentPlayer = (await app.service('players').get(playerId)).name;
  $('.player').removeClass('current');
  $(`#p${playerId}`).addClass('current');
  // document.getElementById('current-player').innerHTML = `Current Player: ${currentPlayer}`;
}

async function updateWinner(playerId) {
  // const currentPlayer = await app.service('players').get(playerId);
  // This will generate 2 different videos on the big screen vs small screen(figure out how to make them the same)
  // Maybe only run this on small, but send socket message to big with the video name
  displayWinnerWithPlayerId(videos[currentGame.id % videos.length], playerId);
  /*
	$(`#p${playerId} > .score`).html(`WINNER`);
	setTimeout(function () {
		window.location = 'index';
	}, 5000)
	*/
  // document.getElementById('current-player').innerHTML = `WINNER: ${currentPlayer.name} (${currentPlayer.score} Points)`;
}

function getCurrentPlayerIndex() {
  let lastPlayerId = currentGame.players[currentGame.player_count - 1].id;
  let currentAndLastPlayerDifference =
    lastPlayerId - currentGame.current_player_id;
  let currentPlayerIndex =
    currentGame.player_count - 1 - currentAndLastPlayerDifference;
  return currentPlayerIndex;
}

function getCurrentPlayerScore() {
  let currentPlayerIndex = getCurrentPlayerIndex();
  return currentGame.players[currentPlayerIndex].score; // There is a bug here somehow (when the current_player_id is 0, but game is running)
}

/***** Andrew functions	****/
// Runs at beginning of someones turn
function tellSomeoneToPutt(name) {
  $('#flow-screens').addClass('putt3');
  $('#flow-screens h1').text(name);
  $('#flow-screens #putt-message').html(
    'Putt<br><span class="lrg">3 Balls</span>'
  );
  $('#flow-screens').fadeIn(flowscreen_fadetime);
  //$('#flow-screens').append('<div id="shots"><div id="s1" class="golf-ball"></div><div id="s2" class="golf-ball"></div><div id="s3" class="golf-ball"></div></div>');
}

// Calls tellSomeoneToPutt using the player number
function tellSomeoneToPuttWithPlayerNum(pNum) {
  var $player = $('.p' + pNum + '.player');
  tellSomeoneToPutt($player.children('.name').text());
}

// Calls tellSomeoneToPutt using the player ID
function tellSomeoneToPuttWithPlayerId(pId) {
  var $player = $('#p' + pId);
  tellSomeoneToPutt($player.children('.name').text());
}

// # for 3 and a randomized message (runs at the end of a player's turn)
function displayScoreAndMessageWithName(name, score, message) {
  $('#flow-screens #putt-score').fadeOut(flowscreen_fadetime);
  $('#flow-screens #putt-message').fadeOut(flowscreen_fadetime, function() {
    $('#flow-screens').removeClass();
    $('#flow-screens h1').text(name);
    $('#flow-screens #putt-score').html(score + ' <span>for</span> 3');
    $('#flow-screens #putt-message').html(message);
    $('#flow-screens, #putt-score, #putt-message').fadeIn(flowscreen_fadetime);
  });
}

// Calls displayScoreAndMessageWithName using the player number
function displayScoreAndMessageWithPlayerNum(pNum, score, message) {
  var $player = $('.p' + pNum + '.player');
  displayScoreAndMessageWithName(
    $player.children('.name').text(),
    score,
    message
  );
}

// Calls displayScoreAndMessageWithName using the player ID
function displayScoreAndMessageWithPlayerId(pId, score, message) {
  var $player = $('#p' + pId);
  displayScoreAndMessageWithName(
    $player.children('.name').text(),
    score,
    message
  );
}

// Display after a successful putt
function displayGreatPuttWithName(name) {
  $('#putt-score').fadeOut(flowscreen_fadetime);
  $('#flow-screens #putt-message').fadeOut(flowscreen_fadetime, function() {
    $('#flow-screens')
      .removeClass()
      .addClass('greatShot');
    $('#flow-screens h1').text(name);
    $('#flow-screens #putt-message')
      .addClass('b4-animate')
      .html(lang_great_shot)
      .show()
      .addClass('animate');
    $('#flow-screens').fadeIn(flowscreen_fadetime);
    setTimeout(function() {
      $('#flow-screens #putt-message').removeClass('b4-animate');
    }, flowscreen_fadetime);
  });
}

// Calls displayGreatPuttWithName using player number
function displayGreatPuttWithPlayerNum(pNum) {
  var $player = $('.p' + pNum + '.player');
  displayGreatPuttWithName($player.children('.name').text());
}

// Calls displayGreatPuttWithName using player ID
function displayGreatPuttWithPlayerId(pId) {
  var $player = $('#p' + pId);
  displayGreatPuttWithName($player.children('.name').text());
}

// Hides the interstitial screen
function removeUserFlowScreen() {
  $('#flow-screens').fadeOut(flowscreen_fadetime, function() {
    $('#flow-screens h1').html('');
    $('#flow-screens #putt-score').html('');
    $('#flow-screens #putt-message').html('');
  });
}

/* Tests */
if (cfg_screen == 'small') {
  setTimeout(function() {
    //socket.emit('game-play-alert', {func: 'removeUserFlowScreen', params : []});
    //socket.emit('game-play-alert', {func: 'tellSomeoneToPutt', params : ['Andrew']});
  }, 1000);
  setTimeout(function() {
    //socket.emit('game-play-alert', {func: 'removeUserFlowScreen', params : []});
  }, 3000);
  setTimeout(function() {
    //socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithName', params : ['Andrew', '0', 'Better Luck<br>Next Time']});
    //socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithPlayerNum', params : [1, '1', 'One is better<br>than nothing']});
    //socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithName', params : ['Andrew', '2', "Way to go!<br>Almost Perfect"]});
    //socket.emit('game-play-alert', {func: 'displayScoreAndMessageWithPlayerNum', params : [2, '3', "We got a<br>pro over here!"]});
  }, 1000);
  setTimeout(function() {
    //socket.emit('game-play-alert', {func: 'displayGreatPuttWithName', params : ['Andrew']});
    //socket.emit('game-play-alert', {func: 'displayGreatPuttWithPlayerNum', params : [1]});
  }, 7000);
  setTimeout(function() {
    //socket.emit('game-play-alert', {func: 'removeUserFlowScreen', params : []});
  }, 9000);
}

function changeHoleColor(hole, color) {
  var rgbHex = color.slice(0,7);
  var whiteValue = color.slice(7);

  if (whiteValue !== '00') {
    rgbHex = `#${whiteValue}${whiteValue}${whiteValue}`;
  }

  $('#hole-' + hole)
      .css( "background-color", rgbHex );
}

function changeAllHoleColors(color) {
  if (hole_colors.includes(color))
    $('.hole')
      .removeClass()
      .addClass('hole ' + color);
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
	
    function displayWinnerWithName(videoName, winnerName) {
		
		if (!videos.includes(videoName))
			videoName = videos[Math.floor(Math.random() * videos.length)];
		
		$('.cancel.button').trigger(event_action);
		$('#winner-is').removeClass().addClass(videoName);
		$('#winner-video source').attr('src', $('#winner-container').attr('data-vid-loc') + videoName + '.mp4');
		
		var video = document.getElementById('winner-video');
		
		video.load();
		if (cfg_screen == 'big')
			music.pause();
		video.onloadeddata = function() {
			$('#winner-container').fadeIn(flowscreen_fadetime, function() {
				video.volume = 1;
				video.play();
				$('#winner-is h1').text(winnerName);
				var winner_timeout;
				switch(videoName) {
					
					case 'rocket':
						winner_timeout = 3000;
					break;
					
					case 'wrecking-ball':
						winner_timeout = 5000;
					break;
					
					case 'shark':
					case 'trophy':
						winner_timeout = 5500;
					break;
					
					case 'fireworks':
						winner_timeout = 7000;
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
			if (cfg_screen == 'big')
				music.play();
			if (cfg_screen == 'small') {
				console.log('finished');
				
				$('#popup #p-content h1').text(lang_great_game);
				$('#popup #p-content p').html(lang_thanks_for_playing+'<br>'+lang_see_you_soon);
				$('#popup #p-content .button.cancel').remove();
				$('.clear.button, .new_game.button').css('display','inline-block');
					
				setTimeout(function() {
					$('.clear.button').trigger(event_action);
				}, cfg_timeout_to_attract);

				$('#winner-container').fadeOut(1000, function() {
					$('body').addClass('open-pop-up');
					$('#popup').fadeIn(flowscreen_fadetime);
				});
				
			}
		};
		
	}
	
	function displayWinnerWithPlayerNum(videoName, pNum) {
		var $player = $('.p'+pNum+'.player');
		displayWinnerWithName(videoName, $player.children('.name').text());
	}

function displayWinnerWithPlayerNum(videoName, pNum) {
  var $player = $('.p' + pNum + '.player');
  displayWinnerWithName(videoName, $player.children('.name').text());
}

function displayWinnerWithPlayerId(videoName, pId) {
  var $player = $('#p' + pId);
  displayWinnerWithName(videoName, $player.children('.name').text());
}
