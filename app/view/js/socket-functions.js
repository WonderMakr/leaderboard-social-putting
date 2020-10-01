var socketURL = 'http://localhost';
var socketPORT = 3000;

function connectToSocket() {
	
	var skt = io(socketURL + ':' + socketPORT, {
		query: 'screen='+cfg_screen,
		reconnection: false,
		reconnectionDelay: 50,
		reconnectionDelayMax: 1000
	});

	return (skt);
}

var socket = connectToSocket('test');

socket.on('connect', function () {
	console.log ('Connected to server...');
});

socket.on('disconnect', function() {
	console.log ('Disconnected from server...');
});

socket.on('change-screen', function(msg) {
	if (cfg_screen == 'big') {
		console.log('changing screen to: ' + msg);
		if (msg.screen == 'go_back')
			history.back();
		else
			window.location = msg.screen;
	}
});