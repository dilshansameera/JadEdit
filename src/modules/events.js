/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var EVENTS = (function() {
	var events = {};

	events.registerEditorEvents = function(editorElements) {
		editorElements.editorButton.onclick = function () {
			editorElements.preview.style.display = 'none';
			editorElements.editor.style.display = 'block';
			editorElements.editorButton.className = "chosen";
			editorElements.previewButton.className = "";
		}

		editorElements.previewButton.onclick = function () {
			editorElements.preview.style.display = 'block';
			editorElements.editor.style.display = 'none';
			editorElements.previewButton.className = "chosen";
			editorElements.editorButton.className = "";

			// preview.innerHTML = translateJade();
		}
	}

	return events;
}());