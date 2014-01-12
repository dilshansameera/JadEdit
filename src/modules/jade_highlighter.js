/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */


var JADE_HIGHLIGHTER = (function (UTIL) {
	var regexCollection = {
		'className': /[.][A-Za-z_\-\\.]+/i,
		'id': /[#][A-Za-z_-]+/i
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

		for (var index = 0; index < currentElement.length; index++) {
			while (regexCollection['className'].test(currentElement)
				|| regexCollection['id'].test(currentElement)) {
				for (var key in regexCollection) {
					if (regexCollection[key].test(currentElement)) {
						var keyword = regexCollection[key].exec(currentElement);
						var keywordLocation = keyword.index;

						result += UTIL.createCodeElement('keyword',
							currentElement.substring(0, keywordLocation));
						result += UTIL.createCodeElement(key, keyword[0]);
						currentElement = currentElement.substring(keywordLocation
							+ keyword[0].length, currentElement.length);
					}
				}

			}
		}

		result += UTIL.createCodeElement('keyword', currentElement);


		result += UTIL.createCodeElement('plain', currentLineContents.substring(firstSpace, currentLineContents.length));

		return {
			'processedLine': result,
			'newLocation': currentLocation
		};
	};

	return jadeHighlighter;
}(UTIL));
