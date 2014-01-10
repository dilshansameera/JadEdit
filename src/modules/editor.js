/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var EDITOR = (function () {
	var editor = {};

	editor.getEditorTemplate = function (inputName) {
		return "<div id='jadedit-container'>" +
			"<div id='jadedit-button-controls'>" +
				"<div id='jadedit-editor-button' class='chosen'>Editor</div>" +
				"<div id='jadedit-preview-button'>Preview</div>" +
			"</div>" +
			"<div id='jadedit-editor-container'>" +
				"<textarea id='jadedit-editor'></textarea>" +
				"<div id='jadedit-preview' style='display: none;'></div>" +
				"<input type='hidden' id='jadedit-hidden' name='" + inputName + "' />" +
			"</div>" +
		"</div>";
	}

	return editor;
}());