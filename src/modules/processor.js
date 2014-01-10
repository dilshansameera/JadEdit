/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var PROCESSOR = (function() {
	var currentProcess = {};

	var processor = {
		html: HTML_PROCESSOR,
		jade: JADE_PROCESSOR,
		markdown: MARKDOWN_PROCESSOR
	};

	// Sets the current processor
	// ==========================

	processor.setCurrentProcessor = function(processorType) {
		if (processorType === 'html') {
			currentProcess =  processor.html;
		} else if (processorType === 'jade') {
			currentProcess =  processor.jade;
		} else if (processorType === 'markdown') {
			currentProcess =  processor.markdown;
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