/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

// This wraps the whole app in a closure which loads jQuery dynamically if one does not exist
// DO NOT MODIFY
(function(){function a(c,d){if(!window.jQuery){var b=document.createElement("script");b.type="text/javascript";if(b.readyState){b.onreadystatechange=function(){if(b.readyState=="loaded"||b.readyState=="complete"){b.onreadystatechange=null;d()}}}else{b.onload=function(){d()}}b.src=c;document.getElementsByTagName("head")[0].appendChild(b)}else{d()}}a("https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",function(){


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

	// Creates Code Elements that wraps each syntax highlighted components
	// ===================================================================

	utilities.createCodeElement = function(className, innerText) {
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


var JADE_HIGHLIGHTER = (function (UTIL) {
	var regexCollection = {
		'id': /[#][A-Za-z_-]+/i,
		'className': /[.][A-Za-z_\-\\.]+/i
	};

	var jadeHighlighter = {};

	jadeHighlighter.highlight = function (currentLocation, splitedByLine) {
		var currentLineContents = splitedByLine[currentLocation];
		if (currentLineContents.length > 1 && currentLocation == splitedByLine.length) {
			return {
				'processedLine': "",
				'newLocation': currentLocation
			}
		}

		var result = "";
		var currentInnerContents = "";

		var firstSpace = currentLineContents.indexOf(' ');
		if (firstSpace == -1) firstSpace = currentLineContents.length;

		var currentElement = currentLineContents.substring(0, firstSpace);
		if (currentLocation != 0) {
			result += '<br/>';
		}

		//TODO: Refactor
		while (regexCollection['className'].test(currentElement)
			|| regexCollection['id'].test(currentElement)) {
			if (getKeywordIndex('className', currentElement) > getKeywordIndex('id', currentElement)) {
				highlightWord('id', regexCollection['id']);
				highlightWord('className', regexCollection['className']);
			} else {
				highlightWord('className', regexCollection['className']);
				highlightWord('id', regexCollection['id']);
			}

		}


		result += UTIL.createCodeElement('keyword', currentElement);
		result += UTIL.createCodeElement('plain', currentLineContents.substring(firstSpace, currentLineContents.length));

		return {
			'processedLine': result,
			'newLocation': currentLocation
		};

		function getKeywordIndex(key, element) {
			if (regexCollection[key].exec(element) == null) {
				return 0;
			}

			return regexCollection[key].exec(element).index;
		}

		function highlightWord(key, regex) {

			if (regex.exec(currentElement) == null) {
				return ;
			}
			var keyword = regex.exec(currentElement);
			var keywordLocation = keyword.index;

			result += UTIL.createCodeElement('keyword',
				currentElement.substring(0, keywordLocation));
			result += UTIL.createCodeElement(key, keyword[0]);

			currentElement = currentElement.substring(keywordLocation
				+ keyword[0].length, currentElement.length);
		}
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
					nonTag = UTIL.createCodeElement('plain', nonTag);
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
								result += UTIL.createCodeElement('keyword',
									currentTagFound.substring(0, keywordLocation));
							} else {
								result += UTIL.createCodeElement('plain',
									currentTagFound.substring(0, keywordLocation));
							}

							result += UTIL.createCodeElement(key, keyword[0]);
							currentTagFound = currentTagFound.substring(keywordLocation
								+ keyword[0].length, currentTagFound.length);
						}
					}
				}

				result += UTIL.createCodeElement('keyword', currentTagFound);

				// Set the current line as remaining texts that comes after the first keyword found
				currentLine = currentLine.substring(currentLine.indexOf(tagsFound[index]) +
					tagsFound[index].length, currentLine.length);
			}

			// Handles lines that does not have a closing tag in the same line
			if (currentLine.length != 0) {
				result += UTIL.createCodeElement('plain', currentLine);
			}
			// Handles lines that does not have any html tags
		} else {
			result += UTIL.createCodeElement('plain', currentLine);
		}

		return {
			'processedLine': result + '\n',
			'newLocation': currentLocation
		};
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

	highlighter.setCurrentHighlighter = function(highlightType) {
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


var EDITOR = (function (PROCESSOR, HIGHLIGHTER) {
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
			"<div id='jadedit-editor-view'>" +
			"<div id='jadedit-highlight-overlay'><span spellcheck='false'></span></div>" +
			"<div id='jadedit-caret-overlay'><span spellcheck='false'></span></div>" +
			"<div id='jadedit-caret'></div>" +
			"<textarea id='jadedit-editor' spellcheck='false'></textarea>" +
			"</div>" +
			"<div id='jadedit-source-view' style='display: none;'></div>" +
			"<div id='jadedit-preview-view' style='display: none;'></div>" +
			"<input type='hidden' id='jadedit-hidden' name='" + inputName + "' />" +
			"</div>" +
			"</div>";
	}

	// Registers different events on the editor
	// ========================================

	editor.registerEditorEvents = function (editorElements) {
		editorElements.$editorButton.click(function () {
			editorElements.$previewView.hide();
			editorElements.$editorView.show();
			editorElements.$sourceView.hide();
			editorElements.$editorButton.addClass('chosen');
			editorElements.$previewButton.removeClass('chosen');
			editorElements.$sourceButton.removeClass('chosen');
		});

		editorElements.$previewButton.click(function () {
			editorElements.$previewView.show();
			editorElements.$editorView.hide();
			editorElements.$sourceView.hide();
			editorElements.$editorButton.removeClass('chosen');
			editorElements.$previewButton.addClass('chosen');
			editorElements.$sourceButton.removeClass('chosen');

			PROCESSOR.setCurrentProcessor('jade');
			var result = PROCESSOR.process(editorElements.$editor.val());
			editorElements.$previewView.html(result);
		});

		editorElements.$sourceButton.click(function () {
			editorElements.$previewView.hide();
			editorElements.$editorView.hide();
			editorElements.$sourceView.show();
			editorElements.$editorButton.removeClass('chosen');
			editorElements.$previewButton.removeClass('chosen');
			editorElements.$sourceButton.addClass('chosen');

			HIGHLIGHTER.setCurrentHighlighter('html');
			editorElements.$sourceView.html(HIGHLIGHTER.highlight(editorElements.$hidden.val()));
		});
	}

	editor.registerCaretEvents = function (editorElements) {
		var timer = 0;
		var cursor = 0;

		editorElements.$editor
			.on("input keydown keyup propertychange click paste cut copy mousedown mouseup change",
			function () {
				clearTimeout(timer);
				timer = setTimeout(update, 10);
			});

		editorElements.$editor.keydown(function(e) {
			// Handling tab keys
			if (e.keyCode === 9) {
				var val = this.value,
					start = this.selectionStart,
					end = this.selectionEnd;

				this.value = val.substring(0, start) + '\t' + val.substring(end);
				this.selectionStart = this.selectionEnd = start + 1;
				return false;
			}
		});

		// Things need to happen when there is a focus to the editor
		// =========================================================

		function update() {

			// CaretOverlay is an overlay on top of the textarea used to calculate caret location
			// highlightOverlay is an overlay on top of the textarea used to display syntax highlighted code

			var editorContent = editorElements.$editor.val()

			HIGHLIGHTER.setCurrentHighlighter('jade');

			// Displaying highlighted code
			editorElements.highlightOverlay.innerHTML = HIGHLIGHTER.highlight(editorContent);
			// Generating overlay for caret location calculation
			editorElements.caretOverlay.innerHTML =
				editorElements
					.$editor.val()
					.substring(0, getCaretPosition(editorElements.$editor[0]))
					.replace(/\n$/, '\n\u0001');

			setCaretXY(editorElements.caretOverlay, editorElements.$editor[0],
				editorElements.$caret[0], getPos(editorElements.$editor));

			PROCESSOR.setCurrentProcessor('jade');
			editorElements.$hidden.val(PROCESSOR.process(editorContent));

			// Makes caret blink as if it's a real cursor
			editorElements.$caret.fadeIn(500).fadeOut(500).fadeIn(500);
			cursor = setInterval(function () {
				editorElements.$caret.fadeIn(500).fadeOut(500).fadeIn(500);
			}, 3000);
		}

		// Gets the position of the caret
		// ==============================

		function getCaretPosition(el) {
			if (el.selectionStart) return el.selectionStart;
			else if (document.selection) {
				var r = document.selection.createRange();
				if (r == null) return 0;

				var re = el.createTextRange(), rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint('EndToStart', re);

				return rc.text.length;
			}
			return 0;
		}

		// Sets the position of the caret
		// ==============================

		function setCaretXY(elem, real_element, caret, offset) {
			var rects = elem.getClientRects();
			var lastRect = rects[rects.length - 1];

			var x = lastRect.left + lastRect.width - offset[0] + document.documentElement.scrollLeft,
				y = lastRect.top - real_element.scrollTop - offset[1] + document.documentElement.scrollTop;

			// Setting the default position the cursor
			if (x == 0 && y == 0) {
				x = 10;
				y = 10;
			}

			caret.style.cssText = "top: " + y + "px; left: " + x + "px";
		}

		// Gets the relative position of the element
		// =========================================

		function getPos(element) {
			var e = element[0];
			var x = 0;
			var y = 0;
			while (e.offsetParent !== null) {
				x += e.offsetLeft;
				y += e.offsetTop;
				e = e.offsetParent;
			}
			return [x, y];
		}
	}

	return editor;
}(PROCESSOR, HIGHLIGHTER));
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

// The staring point of the applications. Initializes the components
// =================================================================

(function Main(EDITOR) {
	var $placeHolder = $("#jadedit");
	if (!$placeHolder.length && !$placeHolder.attr('name').length) {
		document.write('invalid config');
	}

	$placeHolder.html(EDITOR.getEditorTemplate($placeHolder.attr('name')));

	var editorElements = {
		$editorButton: $("#jadedit-editor-button"),
		$previewButton: $('#jadedit-preview-button'),
		$sourceButton: $('#jadedit-source-button'),
		$editorView: $('#jadedit-editor-view'),
		$editor: $('#jadedit-editor'),
		highlightOverlay: $('#jadedit-highlight-overlay')[0].firstChild,
		caretOverlay:  $('#jadedit-caret-overlay')[0].firstChild,
		$caret: $('#jadedit-caret'),
		$sourceView: $('#jadedit-source-view'),
		$previewView: $('#jadedit-preview-view'),
		$hidden: $('#jadedit-hidden')
	};

	EDITOR.registerCaretEvents(editorElements);
	EDITOR.registerEditorEvents(editorElements);
}(EDITOR));
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

// This closes the opening closure which dynamically loads the jQuery library if does not exist.
// Do not modify
});})();
