/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */



var JADE_HIGHLIGHTER = (function (UTIL) {
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

		var currentElement = currentLineContents.substring(0, firstSpace + 1);
		if (currentLocation != 0) {
			result += '<br/>';
		}

		result += UTIL.createCodeElement('keyword', currentElement);
		result += currentLineContents.substring(firstSpace + 1, currentLineContents.length);
		//result += UTIL.createCodeElement('plain', currentLineContents);


		return {
			'processedLine': result,
			'newLocation': currentLocation
		};
	};

	return jadeHighlighter;
}(UTIL));
