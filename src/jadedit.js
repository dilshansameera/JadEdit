/* JadEdit - Editor using JADE template syntax
 * =========================================== */

(function () {

	// Returns editor template
	// =======================

	function getEditorTemplate(inputName) {
		return "<div id='jadedit-container'>" +
			"<div id='jadedit-button-controls'>" +
			"<div id='jadedit-editor-button' class='chosen'>Editor</div>" +
			"<div id='jadedit-preview-button'>Preview</div>" +
			"</div>" +
			"<div id='jadedit-editor-container'>" +
			"<textarea id='jadedit-editor'></textarea>" +
			"<div id='jadedit-preview' style='display: none;'></div>" +
			"<input type='hidden' id='jadedit-hidden' name='" + inputName + "' />"
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
		var hidden = document.getElementById('jadedit-hidden');

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

		editor.onkeyup = function () {
			hidden.value = translateJade();
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
			if (lines[i].trim().length < 1) {
				continue;
			}

			var currentResult = processLine(i, lines);
			result += currentResult.processedLine;
			i = currentResult.newLocation;
		}

		return result;
	}

	// Recursive line translator
	// =========================

	function processLine(currentLocation, allLines) {
		var currentLineContents = allLines[currentLocation];
		var currentInnerContents = "";

		var currentTabCount = tabCounter(currentLineContents);
		currentLineContents = currentLineContents.trim();

		var firstSpace = currentLineContents.indexOf(' ');
		if (firstSpace == -1) firstSpace = currentLineContents.length;

		var currentElement = currentLineContents.substring(0, firstSpace);
		currentInnerContents +=
			currentLineContents.substring(firstSpace, currentLineContents.length).trim();

		// handling child elements
		while (currentLocation + 1 < allLines.length
			&& (currentTabCount + 1) == tabCounter(allLines[currentLocation + 1])) {
			currentLocation++;

			var recursionResult = processLine(currentLocation, allLines);
			currentInnerContents += recursionResult.processedLine;
			currentLocation = recursionResult.newLocation;
		}

		return {
			'processedLine': createTag(currentElement, currentInnerContents),
			'newLocation': currentLocation
		};
	}

	// Forms an html tag
	// =================

	function createTag(element, innerContents) {
		var processedElement = processTagAttributes(element.trim())

		return "<" + processedElement.withAttribute + ">" +
			innerContents +
			"</" + processedElement.withoutAttribute + ">"
	}

	// Returns number of consecutive tabs found in the beginning for a string
	// ======================================================================

	function tabCounter(str) {
		for (var tabCount = 0; tabCount < str.length; tabCount++) {
			if (str[tabCount] != '\t') {
				return tabCount;
			}
		}
	}

	// Process attributes included in element for html tags
	// ====================================================

	function processTagAttributes(element) {
		var elementWithAttribute = "";
		var elementWithoutAttribute = "";

		//TODO: Refactor
		for (var i = 0; i < element.length; i++) {
			if (element[i] == '.') {
				elementWithAttribute += " class='";
				i++;
				while (element[i] != '.' && element[i] != '#' && i < element.length) {
					elementWithAttribute += element[i];
					i++;
				}

				if (element[i] == '.' || element[i] == '#') {
					i--;
				}

				elementWithAttribute += "'";
			} else if (element[i] == '#') {
				elementWithAttribute += " id='";
				i++;
				while (element[i] != '.' && element[i] != '#' && i < element.length) {
					elementWithAttribute += element[i];
					i++;
				}

				if (element[i] == '.' || element[i] == '#') {
					i--;
				}

				elementWithAttribute += "'";
			}
			else {
				elementWithAttribute += element[i];
				elementWithoutAttribute += element[i];
			}

		}

		return {
			'withAttribute': elementWithAttribute,
			'withoutAttribute': elementWithoutAttribute
		}
	}

	// Prepares the editor interface on page load
	// ==========================================

	(function load() {
		var container = document.getElementById('jadedit');
		var inputName = container.getAttribute("name");

		if (container == null) {
			alert('Editor placeholder not found!');
			return;
		}

		if (inputName == null) {
			alert('No name attribute found. Form submit will not work!');
			return;
		}

		container.innerHTML = getEditorTemplate(inputName);
		registerEditorEvents();
	})();
})();