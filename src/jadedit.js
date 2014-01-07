/* JadEdit - Editor using JADE template syntax
 * =========================================== */

(function () {

	// Returns editor template
	// =======================

	function getEditorTemplate() {
		return "<div id='jadedit-container'>" +
			"<div id='jadedit-button-controls'>" +
			"<div id='jadedit-editor-button' class='chosen'>Editor</div>" +
			"<div id='jadedit-preview-button'>Preview</div>" +
			"</div>" +
			"<div id='jadedit-editor-container'>" +
			"<textarea id='jadedit-editor'></textarea>" +
			"<div id='jadedit-preview' style='display: none;'></div>" +
			"</div>" +
			"</div>";
	}

	// Registers events for the editor template
	// ========================================

	function registerEditorEvents() {
		var editorButton = document.getElementById('jadedit-editor-button');
		var previewButton = document.getElementById('jadedit-preview-button');
		var editor = document.getElementById('jadedit-editor');
		var preview = document.getElementById('jadedit-preview');

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

			preview.innerHTML = translateJade();
		}
	}

	// Enables tab key on the editor
	// =============================

	function enableTab(editor) {
		editor.onkeydown = function (e) {
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

	// Converts jade texts in the editor to HTML elements
	// ==================================================

	function translateJade() {
		var source = document.getElementById('jadedit-editor').value;
		var result = "";

		var lines = source.split('\n');

		for (var i = 0; i < lines.length; i++) {
			var currentResult =  processLine(i, lines);
			result += currentResult.processedLine;
			i = currentResult.newLocation;
		}

		return result;
	}

	// Recursive line translator
	// =========================

	function processLine(currentLocation, allLines)
	{
		var currentLineContents = allLines[currentLocation].trim();
		var currentInnerContents = "";

		var firstSpace = currentLineContents.indexOf(' ');
		var currentElement = "";

		// If a space is not found, currentLine maybe representing a tag
		if (firstSpace == -1) {
			currentElement = currentLineContents;
		} else {
			currentElement = currentLineContents.substring(0, firstSpace);
			currentInnerContents +=
				currentLineContents.substring(firstSpace, currentLineContents.length).trim();
		}

		return {
			'processedLine': createTag(currentElement, currentInnerContents),
			'newLocation': currentLocation
		};

//			// Skipping empty lines
//			if (currentLine.length <= 1) {
//				continue;
//			}
//
//			var nextIndex = i;
//			while (++nextIndex < lines.length && lines[nextIndex].indexOf('\t') == 0) {
//
//				var nextLine = lines[nextIndex].trim();
//				var nextFirstSpace = nextLine.indexOf(' ');
//				var childElement = nextLine.substring(0, nextFirstSpace);
//
//				if (childElement != null) {
//					currentBlock +=
//						createTag(childElement, nextLine.substring(nextFirstSpace, nextLine.length).trim());
//				} else {
//					currentBlock += nextLine.substring(nextFirstSpace, nextLine.length).trim();
//				}
//
//				i++;
//			}
//
//			result += createTag(element, currentBlock);
	}

	// Forms an html tag
	// =================

	function createTag(element, innerContents) {
		return "<" + element + ">" + innerContents + "</" + element + ">"
	}

	// Prepares the editor interface on page load
	// ==========================================

	(function load() {
		var container = document.getElementById('jadedit');

		if (container == null) {
			alert('Editor placeholder not found!');
			return;
		}

		container.innerHTML = getEditorTemplate();
		registerEditorEvents();
	})();
})();