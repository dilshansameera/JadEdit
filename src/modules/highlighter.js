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