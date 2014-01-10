/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var EVENTS = (function() {
	var events = {};

	// Registers the global editor events
	// ==================================

	events.registerEditorEvents = function(editorElements) {
		editorElements.editorButton.onclick = function () {
			editorElements.preview.style.display = 'none';
			editorElements.editor.style.display = 'block';
			editorElements.source.style.display = 'none';
			editorElements.editorButton.className = "chosen";
			editorElements.previewButton.className = "";
			editorElements.sourceButton.className = "";
		}

		editorElements.previewButton.onclick = function () {
			editorElements.preview.style.display = 'block';
			editorElements.editor.style.display = 'none';
			editorElements.source.style.display = 'none';
			editorElements.previewButton.className = "chosen";
			editorElements.editorButton.className = "";
			editorElements.sourceButton.className = "";
		}

		editorElements.sourceButton.onclick = function() {
			editorElements.preview.style.display = 'none';
			editorElements.editor.style.display = 'none';
			editorElements.source.style.display = 'block';
			editorElements.previewButton.className = "";
			editorElements.editorButton.className = "";
			editorElements.sourceButton.className = "chosen";
		}
	}

	return events;
}());