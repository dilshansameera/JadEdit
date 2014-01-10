/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var HTML_HIGHLIGHTER = (function (UTIL) {
	var htmlTagRegex = /<.*?>/gi;
	var classRegex = /(?![<](.*?))(class) ?[=](?=(.*?)[>])/i;
	var stringRegex = /(?![<](.*?))['|"](.*?)['|"](?=(.*?)[>])/i;

	var htmlHighlighter = {};

	htmlHighlighter.highlight = function (currentLocation, splitedByLine) {
		var currentLine = splitedByLine[currentLocation];
		var tagsFound = currentLine.match(htmlTagRegex);
		var result = "";

		if (tagsFound != null) {
			for (var index = 0; index < tagsFound.length; index++) {
				// Checks if there is anything comes before finding a html tag, and highlight it as a plain text.
				var nonTag = currentLine.substring(0, currentLine.indexOf(tagsFound[index]));
				if (nonTag.length > 0) {
					nonTag = createCodeElement('plain', nonTag);
				}
				result += nonTag;

				var currentTagFound = tagsFound[index];

				while (classRegex.test(currentTagFound) ||stringRegex.test(currentTagFound)) {
					// Checks if currently being processed html tag has any thing needs to be highlighted
					if (classRegex.test(currentTagFound)) {
						var classLocation = classRegex.exec(currentTagFound).index;

						result += createCodeElement('keyword',
							currentTagFound.substring(0, classLocation));
						result += createCodeElement('attribute', 'class');
						currentTagFound = currentTagFound.substring(classLocation
							+ 'class'.length, currentTagFound.length)
					}

					if (stringRegex.test(currentTagFound)) {
						var string = stringRegex.exec(currentTagFound);
						var stringLocation = string.index;

						result += createCodeElement('keyword',
							currentTagFound.substring(0, stringLocation));
						result += createCodeElement('string', string[0]);
						currentTagFound = currentTagFound.substring(stringLocation
							+ string[0].length, currentTagFound.length)
					}
				}

				result += createCodeElement('keyword', currentTagFound);

				// Set the current line as remaining texts that comes after the first keyword found
				currentLine = currentLine.substring(currentLine.indexOf(tagsFound[index]) +
					tagsFound[index].length, currentLine.length);
			}

			// Handles lines that does not have a closing tag in the same line
			if (currentLine.length != 0) {
				result += createCodeElement('plain', currentLine);
			}
			// Handles lines that does not have any html tags
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
