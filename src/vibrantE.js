/* VibrantE - Markdown Editor
 * =================================================== */

(function () {

	// Returns editor template
	// =======================

	function getEditorTemplate() {
		return "<div id='vibrante-container'>" +
			"<div id='vibrante-button-controls'>" +
			"<div id='vibrante-editor-button' class='chosen'>Editor</div>" +
			"<div id='vibrante-preview-button'>Preview</div>" +
			"</div>" +
			"<div id='vibrante-editor-container'>" +
			"<textarea id='vibrante-editor'></textarea>" +
			"<div id='vibrante-preview' style='display: none;'></div>" +
			"</div>" +
			"</div>";
	}

	// Registers events for the editor template
	// ========================================

	function registerEditorEvents() {
		var editorButton = document.getElementById('vibrante-editor-button');
		var previewButton = document.getElementById('vibrante-preview-button');
		var editor = document.getElementById('vibrante-editor');
		var preview = document.getElementById('vibrante-preview');

		editorButton.onclick = function () {
			preview.style.display = 'none';
			editor.style.display = 'block';
			editorButton.className = "chosen";
			previewButton.className = "";
		}

		previewButton.onclick = function () {
			preview.style.display = 'block';
			editor.style.display = 'none';
			previewButton.className = "chosen";
			editorButton.className = "";

			preview.innerHTML = generateHtml();
		}

		function generateHtml() {
			var editorSource = editor.value;
			return editorSource;
		}
	}

	// Prepares the editor interface on page load
	// ==========================================

	(function load() {
		var container = document.getElementById('vibrante');

		if (container == null) {
			alert('Editor placeholder not found!');
			return;
		}

		container.innerHTML = getEditorTemplate();
		registerEditorEvents();

	})();
})();