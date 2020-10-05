$(document).ready(function () {
	
	$('#popup .cancel.button').on(event_action, function() {
		
		var $this = $(this);
		$this.addClass('active');
		$('.end.button').removeClass('active');
		$('.instructions.button').removeClass('active');
		if (cfg_screen == 'small')
			socket.emit('popup', {popup: 'instructions', action: 'close'});
		$('#popup').fadeOut(500, function() {
			$('body').removeClass('open-pop-up');
			$this.removeClass('active');
		});
		
	});
	
});

if ($('body').attr('id') != 'page-attract')
	$('#black-fade').fadeOut(cfg_fade_time);

function changeScreen(screen) {

	$('#black-fade').fadeIn(cfg_fade_time, function() {
		if (screen == 'go_back')
			history.back();
		else
			window.location = screen;
	});

}