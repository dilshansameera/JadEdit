/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var HTML_HIGHLIGHTER = (function (UTIL) {
	var htmlTagRegex = /<.*?>/g;
	var classRegex = /(?![<](.*?))(class)(?=(.*?)[>])/;

	var htmlHighlighter = {};

	htmlHighlighter.highlight = function (currentLocation, splitedByLine) {
		var currentLine = splitedByLine[currentLocation];
		var tagsFound = currentLine.match(htmlTagRegex);
		var result = "";

		if (tagsFound != null) {
			for (var index = 0; index < tagsFound.length; index++) {
				var nonTag =  currentLine.substring(0, currentLine.indexOf(tagsFound[index]));
				if (nonTag.length > 0) {
					nonTag = createCodeElement('plain', nonTag);
				}
				result += nonTag;

				result += createCodeElement('keyword', tagsFound[index])

				currentLine = currentLine.substring(currentLine.indexOf(tagsFound[index]) +
					tagsFound[index].length, currentLine.length);
			}

			if (currentLine.length != 0) {
				result += createCodeElement('plain', currentLine);
			}
		} else {
			result += createCodeElement('plain', currentLine);
		}


		return {
			'processedLine': result + '\n',
			'newLocation': currentLocation
		};

		// Creates Code Elements that wraps each syntax highlighted components
		// ===================================================================

		function createCodeElement(className, innerText) {
			var codeElement = document.createElement('code');
			codeElement.setAttribute('class', className);
			codeElement.innerText = innerText;

			return codeElement.outerHTML;
		}
	};

	return htmlHighlighter;
}(UTIL));
