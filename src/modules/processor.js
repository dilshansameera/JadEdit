/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var PROCESSOR = (function(processorType) {
	var processor = {
		html: HTML_PROCESSOR,
		jade: JADE_PROCESSOR,
		markdown: MARKDOWN_PROCESSOR
	};

	// Calls the process method according to the processor type passed in
	// ==================================================================

	processor.process = function() {
		if (processorType === 'html') {
			return processor.html.process();
		} else if (processorType === 'jade') {
			return processor.jade.process();
		} else if (processorType === 'markdown') {
			return processor.markdown.process();
		}
	}

	return processor;
}(PROCESSOR));