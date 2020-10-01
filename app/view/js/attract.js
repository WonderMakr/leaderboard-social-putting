$(document).ready(function () {
	
	$('html').on(event_action, function() {
		
		socket.emit('change-screen', {new_screen: 'index'});
		window.location = "index";
		
	});
	
});
