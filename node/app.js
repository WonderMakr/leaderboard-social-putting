var port = 3000;
var http = require('http');
var fs = require('fs');

// create server and start it
var server = http.createServer().listen(port, function() {
	console.log ('Listening on port: ' + port);
});

// bind socket.io to the https server
var io = require('socket.io')(server);

var connections = [];
io.on('connection', function(socket) {
	
	var query = socket.handshake.query;
	var socket_id = String(socket.id);//query.id;
	var address = socket.handshake.address;
	console.log('New connection from ' + address + ': Screen - ' + socket.handshake.query.screen);
	//console.log(query);
	//console.log(socket_id);
	//console.log(connections);
	if (socket.handshake.query.screen == 'small')
		socket.join('small screen');
	
	if (socket.handshake.query.screen == 'big')
		socket.join('big screen');
	
	
	socket.on('disconnect', function() {
		console.log('User disconnected - '+socket_id);
	});
	
	socket.on('change-screen', function(arr) {
		console.log('Change to Screen: ' + arr.new_screen);
		io.in('big screen').emit('change-screen', {screen: arr.new_screen});
	});
	
	socket.on('toggle-number', function(arr) {
		console.log('Toggling number: ' + arr.direction);
		io.in('big screen').emit('toggle-number', {direction: arr.direction});
	});
	
	socket.on('add-name', function(arr) {
		console.log('Adding name: ' + arr.name + ' | Status: ' + arr.status);
		io.in('big screen').emit('add-name', {name: arr.name, status: arr.status});
	});
	
	socket.on('popup', function(arr) {
		console.log('Popup: ' + arr.popup + ' | Action: ' + arr.action);
		io.in('big screen').emit('popup', {popup: arr.popup, action: arr.action});
	});
	
	socket.on('game-play-alert', function(arr) {
		console.log('Game Play Alert: ' + arr.func + ' | Params: ' + arr.params);
		io.emit('game-play-alert', arr);
	});
	
});