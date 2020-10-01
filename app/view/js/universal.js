$(document).ready(function () {
	
	$('#popup .cancel.button').on(event_action, function() {
		
		$('#popup').fadeOut(500, function() {
			$('body').addClass('open-pop-up');
		});
		
	});
	
});
