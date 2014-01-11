/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var EDITOR = (function () {
	var editor = {};

	// Returns a string value representing the editor template
	// =======================================================

	editor.getEditorTemplate = function (inputName) {
		return "<div id='jadedit-container'>" +
			"<div id='jadedit-button-controls'>" +
				"<div id='jadedit-editor-button' class='chosen'>Editor</div>" +
				"<div id='jadedit-source-button'>Source</div>" +
				"<div id='jadedit-preview-button'>Preview</div>" +
			"</div>" +
			"<div id='jadedit-editor-container'>" +
				"<textarea id='jadedit-editor' spellcheck='false'></textarea>" +
				"<div id='jadedit-source' style='display: none;'></div>" +
				"<div id='jadedit-preview' style='display: none;'></div>" +
				"<input type='hidden' id='jadedit-hidden' name='" + inputName + "' />" +
			"</div>" +
		"</div>";
	}

	return editor;
}());
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
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var UTIL = (function() {
	var utilities = {};

	// Counts the number of tabs in a string passed in
	// ===============================================

	utilities.tabCounter = function(str) {
		for (var tabCount = 0; tabCount < str.length; tabCount++) {
			if (str[tabCount] != '\t') {
				return tabCount;
			}
		}
	}

	// Trims only the white spaces in the beginning of the string
	// ==========================================================

	utilities.trimStart = function(str) {
		return str.replace(/^( |\t)+/, '');
	}

	return utilities;
}());
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var JADE_PROCESSOR = (function(UTIL) {
	var jadeProcessor = {};

	jadeProcessor.process = function(currentLocation, splitedByLine) {
		var currentLineContents = splitedByLine[currentLocation];
		if (currentLineContents.length < 1) {
			return {
				'processedLine': "",
				'newLocation': currentLocation
			}
		}

		var currentInnerContents = "";

		var currentTabCount = UTIL.tabCounter(currentLineContents);
		currentLineContents =  UTIL.trimStart(currentLineContents);

		var isContinuedLine = currentLineContents[0] == '|';

		var firstSpace = currentLineContents.indexOf(' ');
		if (firstSpace == -1) firstSpace = currentLineContents.length;

		var currentElement = currentLineContents.substring(0, firstSpace);
		currentInnerContents +=
			UTIL.trimStart(currentLineContents.substring(firstSpace, currentLineContents.length));

		// handling child elements
		while (currentLocation + 1 < splitedByLine.length
			&& (currentTabCount + 1) == UTIL.tabCounter(splitedByLine[currentLocation + 1])) {
			currentLocation++;

			var recursionResult = this.process(currentLocation, splitedByLine);
			currentInnerContents += recursionResult.processedLine;
			currentLocation = recursionResult.newLocation;
		}

		return {
			'processedLine': createTag(currentElement, currentInnerContents, isContinuedLine),
			'newLocation': currentLocation
		};
	};

	function createTag(element, innerContents, isContinuedLine) {
		var processedElement = processTagAttributes(UTIL.trimStart(element));
		if (processedElement.withoutAttribute === 'pre') {
			if (!isContinuedLine)
				return "<" + processedElement.withAttribute + ">" +
					innerContents +
					"</" + processedElement.withoutAttribute + ">";
			else
				return innerContents;
		}

		if (processedElement.withoutAttribute !== 'br' && processedElement.withoutAttribute !== 'pre') {
			if (!isContinuedLine)
				return "<" + processedElement.withAttribute + ">" +
					innerContents +
					"</" + processedElement.withoutAttribute + ">\n";
			else
				return innerContents + '\n';
		}
		if (!isContinuedLine)
			return "<" + processedElement.withAttribute + "/>" +
				innerContents + '\n';
		else
			return innerContents + '\n';
	}

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
			else if (element[i] == '(') {
				while (element[i] != ')' && i < element.length) {

				}
			}
			else {
				elementWithAttribute += element[i];
				elementWithoutAttribute += element[i];
			}
		}

		return {
			'withAttribute': elementWithAttribute,
			'withoutAttribute': elementWithoutAttribute
		};
	}

	return jadeProcessor;
}(UTIL));
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var HTML_PROCESSOR = (function(UTIL) {
	var htmlProcessor = {};

	htmlProcessor.process = function() {
		return "";
	};

	return htmlProcessor;
}(UTIL));
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var PROCESSOR = (function() {
	var currentProcess = {};

	var processor = {
		html: HTML_PROCESSOR,
		jade: JADE_PROCESSOR
	};

	// Sets the current processor
	// ==========================

	processor.setCurrentProcessor = function(processorType) {
		if (processorType === 'html') {
			currentProcess =  processor.html;
		} else if (processorType === 'jade') {
			currentProcess =  processor.jade;
		}
	}

	// Calls the process method of the current processor
	// =================================================

	processor.process = function(source) {
		var result = "";

		var splitedByLine = source.split('\n');

		for (var i = 0; i < splitedByLine.length; i++) {
			var currentResult = currentProcess.process(i, splitedByLine);
			result += currentResult.processedLine;
			i = currentResult.newLocation;
		}

		return result;
	}

	return processor;
}());
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var JADE_HIGHLIGHTER = (function(UTIL) {
	var jadeHighlighter = {};

	jadeHighlighter.highlight = function() {
		return "";
	};

	return jadeHighlighter;
}(UTIL));

/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var HTML_HIGHLIGHTER = (function (UTIL) {
	var htmlTagRegex = /(?!<)[A-Za-z'" =\d:]+(?=(>|\/>))/gi;

	// Regex for detecting certain keywords inside the HTML tag
	var regexCollection = {
		// Class attribute
		//'attribute': /(?![<](.*?))(class|id|href|type|rel|accesskey|hidden|required|style) ?(?=(=))(?=(.*?)[>])/i,
		'attribute': /(\s)+(class|id|href|type|rel|accesskey|hidden|required|style) ?(?=(=))/i,
		// String literal
		//'string': /(?![<](.*?))['|"](.*?)['|"](?=(.*?)[>])/i
		'string': /(?![=](\s)+)['|"](.*?)['|"]/
	};

	var htmlHighlighter = {};

	htmlHighlighter.highlight = function (currentLocation, splitedByLine) {
		var currentLine = splitedByLine[currentLocation];
		var tagsFound = currentLine.match(htmlTagRegex);
		var result = "";

		if (tagsFound != null) {
			for (var index = 0; index < tagsFound.length; index++) {
				// Checks if there is anything comes before finding a html tag, and highlight it as a plain text.
				var nonTag = currentLine.substring(0, currentLine.indexOf(tagsFound[index]));
				if (nonTag.length > 0) {
					nonTag = createCodeElement('plain', nonTag);
				}
				result += nonTag;

				var currentTagFound = tagsFound[index];

				// highlights all attributes and strings in the current tag found
				while (regexCollection['attribute'].test(currentTagFound)
					|| regexCollection['string'].test(currentTagFound)) {
					for (var key in regexCollection) {
						if (regexCollection[key].test(currentTagFound)) {
							var keyword = regexCollection[key].exec(currentTagFound);
							var keywordLocation = keyword.index;

							if (currentTagFound.substring(0, keywordLocation) != '=') {
								result += createCodeElement('keyword',
									currentTagFound.substring(0, keywordLocation));
							} else {
								result += createCodeElement('plain',
									currentTagFound.substring(0, keywordLocation));
							}

							result += createCodeElement(key, keyword[0]);
							currentTagFound = currentTagFound.substring(keywordLocation
								+ keyword[0].length, currentTagFound.length);
						}
					}
				}

				result += createCodeElement('keyword', currentTagFound);

				// Set the current line as remaining texts that comes after the first keyword found
				currentLine = currentLine.substring(currentLine.indexOf(tagsFound[index]) +
					tagsFound[index].length, currentLine.length);
			}

			// Handles lines that does not have a closing tag in the same line
			if (currentLine.length != 0) {
				result += createCodeElement('plain', currentLine);
			}
			// Handles lines that does not have any html tags
		} else {
			result += createCodeElement('plain', currentLine);
		}

		return {
			'processedLine': result + '\n',
			'newLocation': currentLocation
		};

		// Creates Code Elements that wraps each syntax highlighted components
		// ===================================================================

		function createCodeElement(className, innerText) {
			var codeElement = document.createElement('code');
			codeElement.setAttribute('class', className);

			// FireFox does not support InnerText
			if (codeElement.innerText == undefined) {
				codeElement.textContent = innerText;
			} else {
				codeElement.innerText = innerText;
			}

			return codeElement.outerHTML;
		}
	};

	return htmlHighlighter;
}(UTIL));

/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var HIGHLIGHTER = (function() {
	var currentHighlighter = {};

	// Highlighter configurations
	// ==========================

	var highlighter = {
		html: HTML_HIGHLIGHTER,
		jade: JADE_HIGHLIGHTER
	};

	// Sets the current highlighter
	// ============================

	highlighter.setCurrentProcessor = function(highlightType) {
		if (highlightType === 'html') {
			currentHighlighter =  highlighter.html;
		} else if (highlightType === 'jade') {
			currentHighlighter =  highlighter.jade;
		}
	}

	highlighter.highlight = function(source) {
		var result = "";

		var splitedByLine = source.split('\n');

		for (var i = 0; i < splitedByLine.length; i++) {
			var currentResult = currentHighlighter.highlight(i, splitedByLine);
			result += currentResult.processedLine;
			i = currentResult.newLocation;
		}

		return result;
	}

	return highlighter;

}());
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var KEYSTROKE_HANDLER = (function (PROCESSOR, HIGHLIGHTER) {
	var keystrokeHandler = {};

	// Enables tab key functionality in the editor
	// ==========================================

	keystrokeHandler.enableTab = function (editorElements) {
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

	keystrokeHandler.enablePreview = function (editorElements) {
		editorElements.editor.onkeyup = function () {
			var result = PROCESSOR.process(editorElements.editor.value);

			HIGHLIGHTER.setCurrentProcessor('html');



				//editorElements.source.innerHTML = HIGHLIGHTER.highlight(result);
			editorElements.source.innerHTML =HIGHLIGHTER.highlight(result);


			editorElements.hidden.value = result;
			editorElements.preview.innerHTML = result;
		}
	}

	return keystrokeHandler;
}(PROCESSOR, HIGHLIGHTER));
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

// The staring point of the applications. Initializes the components
// =================================================================

(function Main(EDITOR, EVENTS, KEYSTROKE_HANDLER, PROCESSOR) {
	var editorContainer = document.getElementById('jadedit');
	if (editorContainer.length) {
		document.write('Editor Container is not found.');
		return;
	}

	if (!editorContainer.hasAttribute('name')) {
		document.write('Editor does not have a name.');
		return;
	}

	editorContainer.innerHTML = EDITOR.getEditorTemplate(editorContainer.getAttribute('name'));

	var editorElements = {
		editorButton: document.getElementById('jadedit-editor-button'),
		previewButton: document.getElementById('jadedit-preview-button'),
		sourceButton: document.getElementById('jadedit-source-button'),
		editor:  document.getElementById('jadedit-editor'),
		source: document.getElementById('jadedit-source'),
		preview: document.getElementById('jadedit-preview'),
		hidden:  document.getElementById('jadedit-hidden')
	};

	EVENTS.registerEditorEvents(editorElements);
	KEYSTROKE_HANDLER.enableTab(editorElements);

	PROCESSOR.setCurrentProcessor('jade');
	KEYSTROKE_HANDLER.enablePreview(editorElements);

}(EDITOR, EVENTS, KEYSTROKE_HANDLER, PROCESSOR));
