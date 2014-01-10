/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var KEYSTROKE_HANDLER = (function (PROCESSOR) {
	var keystrokeHandler = {};

	// Enables tab key functionality in the editor
	// ==========================================

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

	// Sets the type of process to use on key up event in the editor
	// ============================================================
	//TODO: Should we move this to the process.js file?

	keystrokeHandler.enablePreview = function(editor, hidden, processorType) {
		editor.onkeyup = function () {
			hidden.value = PROCESSOR.process(processorType);
		}
	}

	return keystrokeHandler;
}(PROCESSOR));