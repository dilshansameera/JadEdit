/* VibrantE - Jade Editor
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

		enableTab(editor);

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

			preview.innerHTML = TranslateJade();
		}
	}

	// Enables tab key on the editor
	// =============================

	function enableTab(editor) {
		editor.onkeydown = function(e) {
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

	// Converts texts in editor to HTML elements
	// =========================================

	function TranslateJade() {
		var editor = document.getElementById('vibrante-editor');
		var editorSource = "";

		var lines = editor.value.split('\n');
		for (var line in lines) {
			var currentLine = lines[line].trim();
			var space = currentLine.indexOf(' ');

			if (currentLine[0] == '\t') {

			}

			var element = currentLine.substring(0, space);
			var newLine = "<" + element + ">" + currentLine.substring(space, currentLine.length).trim() + "</" + element + ">";

			editorSource += newLine;
		}

		return editorSource;
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