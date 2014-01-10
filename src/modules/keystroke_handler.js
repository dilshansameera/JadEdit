/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */


var KEYSTROKE_HANDLER = (function () {
	var keystrokeHandler = {};

	keystrokeHandler.enableTab = function(editor)
	{
		editor.keydown = function (e) {
			if (e.keyCode === 9) {
				var val = this.value,
					start = this.selectionStart,
					end = this.selectionEnd;

				this.value = val.substring(0, start) + '\t' + val.substring(end);
				this.selectionStart = this.selectionEnd = start + 1;
				return false;
			}
		};
	}

	keystrokeHandler.enablePreview = function(editor, hidden) {
		editor.onkeyup = function () {
			hidden.value = translateJade();
		}
	}

	return keystrokeHandler;
}());