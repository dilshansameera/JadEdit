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