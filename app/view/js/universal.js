$(document).ready(function () {
	
	
	
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