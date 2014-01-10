/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var KEYSTROKE_HANDLER = (function (PROCESSOR, HIGHLIGHTER) {
	var keystrokeHandler = {};

	// Enables tab key functionality in the editor
	// ==========================================

	keystrokeHandler.enableTab = function(editorElements)
	{
		editorElements.editor.onkeydown = function (e) {
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

	keystrokeHandler.enablePreview = function(editorElements) {
		editorElements.editor.onkeyup = function () {
			var result = PROCESSOR.process(editorElements.editor.value);

			HIGHLIGHTER.setCurrentProcessor('html');

			editorElements.source.innerHTML = HIGHLIGHTER.highlight(result);
			editorElements.hidden.value = result;
			editorElements.preview.innerHTML = result;
		}
	}

	return keystrokeHandler;
}(PROCESSOR, HIGHLIGHTER));