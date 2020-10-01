$(document).ready(function () {
	
	var processing = false;
	$('.button').on(event_action, function() {
	
		if (processing)
			return false;
		
		processing = true;
		
		var $this = $(this);
		
		$this.addClass('active');
		
		if ($this.hasClass('back')) {
			socket.emit('change-screen', {new_screen: 'index'});
			window.location = "index";
		} else {
			var new_screen = $this.attr('data-link');
			socket.emit('change-screen', {new_screen: new_screen});
			window.location = new_screen;
		}
		
	});
	
});
