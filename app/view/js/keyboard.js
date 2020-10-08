$(document).ready(function() {
  // Default input
  var write = false;
  var shift = false;
  
  //$(".click-validate span.error").addClass("hide");
/*
	FORCE UPPERCASE ON KEYBOARD
  $('.left-shift').toggleClass('active');
  $('.left-shift').addClass('opaque');
  $('.letter, .symbol').toggleClass('uppercase');
  
*/	/*
	$('input').click(function(e) {
		console.log(doGetCaretPosition($(this)));
    });
	*/

  // Change the input on focus change
  $('input:not([type=checkbox])').focus(function() {
	  
    $('input').removeClass('focus');
    write = $(this);
    write.addClass('focus');

    $('ul.keyboard li').removeClass('opaque');
	
	$('ul.keyboard li.hyphen').removeClass('opaque');

	if (write.attr('id').includes("display_name")) {

		$('ul.keyboard li.period').removeClass('opaque');
		$('ul.keyboard li.comma').removeClass('opaque');
		$('ul.keyboard li.ampersand').removeClass('opaque');
		$('ul.keyboard .key-left li.symbol').removeClass('opaque');
	}

	if (write.val() == "" && !$('.left-shift').hasClass('active')) {
		$('.left-shift').addClass('active');
		$('.letter, .symbol').addClass('uppercase');
	} else if (write.val() == "" && $('.left-shift').hasClass('active')) {
		// do nothing
	} else {
		$('.left-shift').removeClass('active');
		$('.letter, .symbol').removeClass('uppercase');
	}

	  
  });

  // click listener for each key
  $('.keyboard li').on(event_action, function() {
    if ($(this).hasClass('opaque')) return false;
	  
	if ($('body').attr('id') == 'page-player-names') {
		if (($('#player').val().length >= char_limit || $('.complete.button').length > 0) && !$(this).hasClass('delete'))
			return false;
	}
	if ($('body').attr('id') == 'page-num-of-players' && write) {
		if (write.val().length >= write.attr('maxlength'))
			return false;
	}
    // Shift keys
	
    if ($(this).hasClass('left-shift')) {
	  
      $('.left-shift').toggleClass('active');
      $('.letter, .symbol').toggleClass('uppercase');
      shift = shift === true ? false : true;
      console.log('Shift changed to: ', shift);
	  
		return false;
    }

    if (write != false) {
      var $this = $(this),
        character = $this.html();

      if (!$this.hasClass('spacer')) {
        if ($this.hasClass('uppercase')) {
          character = character.toUpperCase();
        }

        // Close keyboard key
        if ($this.hasClass('close')) {
          $('#' + write.attr('id')).trigger('blur');
          $('#keyboard-container')
            .removeClass('slideInUp')
            .addClass('slideOutDown');
          return false;
        }

        // Delete key
        if ($this.hasClass('delete')) {
          //var html = write.val();
          //write.val(html.substr(0, html.length - 1));
          //write.sendkeys('{backspace}');
		  $this.addClass('active');
			
          insertAtCaret(write.attr('id'), '{backspace}');
          if (
            write.attr('id') == 'first-name' ||
            write.attr('id') == 'last-name' ||
            write.attr('id') == 'city'
          ) {
            if (write.val().length == 0) {
              $('#' + write.attr('id')).trigger('focus');
            }
          }
		  setTimeout(function() {
		    $this.removeClass('active');
		  }, 200);
          return false;
        }

        // Symbol
        if ($this.hasClass('symbol') && $this.children('span').length == 2) {
          character = $this
            .children('span')
            .first()
            .html();
        }

        if (character == '&nbsp;') character = ' ';
        else if (character == '&amp;') character = '&';
        else if ($this.hasClass('r_last'))
          character = $('#lastName')
            .val()
            .toLowerCase()
            .replace(/\s/g, '');
        else if ($this.hasClass('r_first'))
          character = $('#firstName')
            .val()
            .toLowerCase()
            .replace(/\s/g, '');

        // Add the character
        $this.addClass('active');
        setTimeout(function() {
          $this.removeClass('active');
        }, 200);
        //write.val(write.val() + character);
        //write.sendkeys(character);
        insertAtCaret(write.attr('id'), character);

        if ($('.left-shift').hasClass('active'))
          $('.left-shift').trigger(event_action);

        // scroll right if necessary
        write.scrollLeft(write.val().length * 6);
        return false;
      }
    }
  });


  function insertAtCaret(areaId, text) {
	  
    var txtarea = document.getElementById(areaId);
    if (!txtarea) {
      return;
    }
	  
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br =
      txtarea.selectionStart || txtarea.selectionStart == '0'
        ? 'ff'
        : document.selection ? 'ie' : false;
    if (br == 'ie') {
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart('character', -txtarea.value.length);
      strPos = range.text.length;
    } else if (br == 'ff') {
      strPos = txtarea.selectionStart;
    }
	  
	  if (areaId == 'guess' && strPos > 7 && text != '{backspace}')
		  return false;
	  
    var front = txtarea.value.substring(0, strPos);
    var back = txtarea.value.substring(strPos, txtarea.value.length);
    if (text == '{backspace}') {
      txtarea.value = front.substr(0, front.length - 1) + back;
      strPos = strPos - 1;
    } else {
      txtarea.value = front + text + back;
      strPos = strPos + text.length;
    }
    if (br == 'ie') {
      txtarea.focus();
      var ieRange = document.selection.createRange();
      ieRange.moveStart('character', -txtarea.value.length);
      ieRange.moveStart('character', strPos);
      ieRange.moveEnd('character', 0);
      ieRange.select();
    } else if (br == 'ff') {
      txtarea.selectionStart = strPos;
      txtarea.selectionEnd = strPos;
      txtarea.focus();
    }

    txtarea.scrollTop = scrollPos;
  }
});
