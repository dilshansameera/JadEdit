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
