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

	highlighter.process = function(source) {

		// return currentHighlighter.highlight();
	}

	return highlighter;

}());