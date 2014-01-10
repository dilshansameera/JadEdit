/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var UTIL = (function() {
	var utilities = {};

	utilities.tabCounter = function(str) {
		for (var tabCount = 0; tabCount < str.length; tabCount++) {
			if (str[tabCount] != '\t') {
				return tabCount;
			}
		}
	}

	utilities.trimStart = function(str) {
		return str.replace(/^( |\t)+/, '');
	}

	return utilities;
}());