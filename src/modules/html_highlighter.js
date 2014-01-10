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
				var nonTag =  currentLine.substring(0, currentLine.indexOf(tagsFound[index]));
				if (nonTag.length > 0) {
					var plain = document.createElement('code');
					plain.setAttribute('class', 'plain');
					plain.innerText += nonTag;

					nonTag = plain.outerHTML;
				}

				result += nonTag;

				var newTag = document.createElement('code');
				newTag.setAttribute('class', 'keyword');
				newTag.innerText += tagsFound[index];

				result += newTag.outerHTML;

				currentLine = currentLine.substring(currentLine.indexOf(tagsFound[index]) +
					tagsFound[index].length, currentLine.length);
			}

			if (currentLine.length != 0) {
				var plain = document.createElement('code');
				plain.setAttribute('class', 'plain');
				plain.innerText += currentLine;

				result += plain.outerHTML;
			}
		} else {
			var plain = document.createElement('code');
			plain.setAttribute('class', 'plain');
			plain.innerText += currentLine;

			result += plain.outerHTML;
		}


		return {
			'processedLine': result + '\n',
			'newLocation': currentLocation
		};
	};

	return htmlHighlighter;
}(UTIL));
