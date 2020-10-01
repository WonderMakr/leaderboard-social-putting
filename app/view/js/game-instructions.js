$(document).ready(function () {
	
	$('.button').on(event_action, function() {
	
		var $this = $(this);
		
		$this.addClass('active');
		socket.emit('change-screen', {new_screen: 'go_back'});
		history.back();
		
	});
	
});
