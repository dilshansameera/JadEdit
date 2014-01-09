$(document).ready(function () {
	SyntaxHighlighter.defaults.toolbar = false;
	SyntaxHighlighter.all();

	var $jadeEditor = $("#jade-editor");
	var $htmlEditor = $("#html-editor");
	var $output = $("#output");
	var $htmlEditorContainer = $('#html-editor-container');

	enableTab($jadeEditor);
	enableTab($htmlEditor);

	$jadeEditor.keyup(function () {
		$htmlEditorContainer.empty();
		var $newHtmlEditor = '<pre class="brush:xml" id="html-editor"><pre>';
		$htmlEditorContainer.append($newHtmlEditor);
		var $htmlEditor = $("#html-editor");
		$htmlEditor.text(translateJade());
		$output.html(translateJade());
		SyntaxHighlighter.defaults.toolbar = false;
		SyntaxHighlighter.highlight();
	});

	var testString = 'h1 Hello, there!\n' +
		'br\n' +
		'p\n' +
		'\t| JadEdit is an embeddable JavaScript editor \n' +
		'\t| that allows you to create stylish documents \n' +
		'\t| using Jade template syntax.\n' +
		'\t| This project is in a very early stage\n' +
		'\t| of the development,\n' +
		'\t| so make sure you follow the project on GitHub and\n' +
		'\t| check out the issue tracker to find out\n' +
		'\t| how you can contribute!\n' +
		'br\n' +
		'h6 Here are some  of the things I like about JadEdit.\n' +
		'br\n' +
		'ul\n' +
		'\tli\n' +
		'\t\t| Uses HTML like syntax (Jade). \n' +
		'\t\t| Easier to learn and use than MarkDown.\n' +
		'\tli\n' +
		'\t\t| Can easily add class names and \n' +
		'\t\t| ids to use with external CSS styles. \n' +
		'\tli Create and apply styles on the fly.\n' +
		'br\n' +
		'h6 Here is an example of how I am using JadEdit:\n' +
		'br\n' +
		'figure\n' +
		'\tfigcaption My Code Snippet\n' +
		'pre.brush:js\n' +
		'\t| function () { \n' +
		'\t| console.log("Hello, World!"); \n' +
		'\t| }\n' +
		'p.orange\n' +
		'\t| *Using Alex Gorbatchev\'s Syntax Highlighter.\n' +
		'br\n' +
		'p\n' +
		'\t| Pretty cool, huh?\n' +
		'\tbr\n' +
		'\t| Be sure to try it on the JadEdit column!\n' +
		'style\n' +
		'\t| h1, h6 { color: yellow; }\n' +
		'\t| .orange { color: darkorange; }\n';

	var i = 0;

	var interval = setInterval(function() {
		if (i <= testString.length) {
			$jadeEditor.val(testString.substring(0, i += 3));
		}

		if (i >= testString.length) {
			clearInterval(interval);
		}

		if (i > 20 && testString.substring(i - 20, i).indexOf('brush') == -1) {
			$htmlEditorContainer.empty();
			var $newHtmlEditor = '<pre class="brush:xml" id="html-editor"><pre>';
			$htmlEditorContainer.append($newHtmlEditor);
			var $htmlEditor = $("#html-editor");
			$htmlEditor.text(translateJade());
			$output.html(translateJade());
			SyntaxHighlighter.defaults.toolbar = false;
			SyntaxHighlighter.highlight();
		}


	}, 30)

	$htmlEditor.text(translateJade());
	$output.html(translateJade());
});

function enableTab(editor) {
	editor.keydown(function (e) {
		if (e.keyCode === 9) {
			var val = this.value,
				start = this.selectionStart,
				end = this.selectionEnd;

			this.value = val.substring(0, start) + '\t' + val.substring(end);
			this.selectionStart = this.selectionEnd = start + 1;
			return false;
		}
	});
}

function translateJade() {
	var source = document.getElementById('jade-editor').value;
	var result = "";

	var lines = source.split('\n');

	for (var i = 0; i < lines.length; i++) {
		if (lines[i].trimStart().length < 1) {
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
	currentLineContents = currentLineContents.trimStart();

	var isContinuedLine = currentLineContents[0] == '|';

	var firstSpace = currentLineContents.indexOf(' ');
	if (firstSpace == -1) firstSpace = currentLineContents.length;

	var currentElement = currentLineContents.substring(0, firstSpace);
	currentInnerContents +=
		currentLineContents.substring(firstSpace, currentLineContents.length).trimStart();

	// handling child elements
	while (currentLocation + 1 < allLines.length
		&& (currentTabCount + 1) == tabCounter(allLines[currentLocation + 1])) {
		currentLocation++;

		var recursionResult = processLine(currentLocation, allLines);
		currentInnerContents += recursionResult.processedLine;
		currentLocation = recursionResult.newLocation;
	}

	return {
		'processedLine': createTag(currentElement, currentInnerContents, isContinuedLine),
		'newLocation': currentLocation
	};
}

// Forms an html tag
// =================

function createTag(element, innerContents, isContinuedLine) {
	var processedElement = processTagAttributes(element.trimStart());
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

	// Check for ., #, or (
	// On second . it should be added to the existing class attribute, instead of creating another class
	// on second # it should replace the old existing id declaration
	// On (

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

String.prototype.trimStart = function () {
	return this.replace(/^( |\t)+/, '');
}