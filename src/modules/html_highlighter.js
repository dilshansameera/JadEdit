/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var HTML_HIGHLIGHTER = (function (UTIL) {
	var htmlTagRegex = /(?!<)[A-Za-z'" =\d:]+(?=(>|\/>))/gi;

	// Regex for detecting certain keywords inside the HTML tag
	var regexCollection = {
		// Class attribute
		//'attribute': /(?![<](.*?))(class|id|href|type|rel|accesskey|hidden|required|style) ?(?=(=))(?=(.*?)[>])/i,
		'attribute': /(\s)+(class|id|href|type|rel|accesskey|hidden|required|style) ?(?=(=))/i,
		// String literal
		//'string': /(?![<](.*?))['|"](.*?)['|"](?=(.*?)[>])/i
		'string': /(?![=](\s)+)['|"](.*?)['|"]/
	};

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

				while (regexCollection['attribute'].test(currentTagFound)
					|| regexCollection['string'].test(currentTagFound)) {
					for (var key in regexCollection) {
						if (regexCollection[key].test(currentTagFound)) {
							var keyword = regexCollection[key].exec(currentTagFound);
							var keywordLocation = keyword.index;

							if (currentTagFound.substring(0, keywordLocation) != '=') {
								result += createCodeElement('keyword',
									currentTagFound.substring(0, keywordLocation));
							} else {
								result += createCodeElement('plain',
									currentTagFound.substring(0, keywordLocation));
							}
							result += createCodeElement(key, keyword[0]);
							currentTagFound = currentTagFound.substring(keywordLocation
								+ keyword[0].length, currentTagFound.length);
						}
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
