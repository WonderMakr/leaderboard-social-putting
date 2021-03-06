var socketURL = 'http://localhost';
var socketPORT = 3000;

var feathersPORT = 3030;

// Set up socket.io
const feathersSocket = io(`${socketURL}:${feathersPORT}`);

// Initialize a Feathers app
const app = feathers();

// Register socket.io to talk to our server
app.configure(feathers.socketio(feathersSocket));

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
	
	console.log('changing screen to: ' + msg);

	$('#black-fade').fadeIn(cfg_fade_time, function() {

		if (msg.screen == 'go_back')
			history.back();
		else
			window.location = msg.screen;
	});

	
});