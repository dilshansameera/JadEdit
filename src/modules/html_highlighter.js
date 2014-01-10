/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var HTML_HIGHLIGHTER = (function (UTIL) {
	var htmlTagRegex = /<.*?>/g;

	var htmlHighlighter = {};

	htmlHighlighter.highlight = function (currentLocation, splitedByLine) {
		var currentLine = splitedByLine[currentLocation];
		var tagsFound = currentLine.match(htmlTagRegex);
		var result = "";

		if (tagsFound != null) {

			for (var index = 0; index < tagsFound.length; index++) {
				result += currentLine.substring(0, currentLine.indexOf(tagsFound[index]));

				var newTag = document.createElement('code');
				newTag.setAttribute('class', 'keyword');
				newTag.innerText += tagsFound[index];

				result += newTag.outerHTML;

				currentLine = currentLine.substring(currentLine.indexOf(tagsFound[index]) +
					tagsFound[index].length, currentLine.length);
			}

			if (currentLine.length != 0) {
				result += currentLine;
			}
		} else {
			result += currentLine;
		}


		return {
			'processedLine': result + '\n',
			'newLocation': currentLocation
		};
	};

	return htmlHighlighter;
}(UTIL));
