/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var UTIL = (function() {
	var utilities = {};

	// Counts the number of tabs in a string passed in
	// ===============================================

	utilities.tabCounter = function(str) {
		for (var tabCount = 0; tabCount < str.length; tabCount++) {
			if (str[tabCount] != '\t') {
				return tabCount;
			}
		}
	}

	// Trims only the white spaces in the beginning of the string
	// ==========================================================

	utilities.trimStart = function(str) {
		return str.replace(/^( |\t)+/, '');
	}

	return utilities;
}());