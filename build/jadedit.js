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
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

var EVENTS = (function() {
	var events = {};

	events.registerEditorEvents = function(editorElements) {
		editorElements.editorButton.onclick = function () {
			editorElements.preview.style.display = 'none';
			editorElements.editor.style.display = 'block';
			editorElements.editorButton.className = "chosen";
			editorElements.previewButton.className = "";
		}

		editorElements.previewButton.onclick = function () {
			editorElements.preview.style.display = 'block';
			editorElements.editor.style.display = 'none';
			editorElements.previewButton.className = "chosen";
			editorElements.editorButton.className = "";

			// preview.innerHTML = translateJade();
		}
	}

	events.registerPreviewProcessor = function(preview, processorType) {
		preview.innerHTML = PROCESSOR.process(processorType);
	}

	return events;
}());
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
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */


var KEYSTROKE_HANDLER = (function () {
	var keystrokeHandler = {};

	keystrokeHandler.enableTab = function(editor)
	{
		editor.keydown = function (e) {
			if (e.keyCode === 9) {
				var val = this.value,
					start = this.selectionStart,
					end = this.selectionEnd;

				this.value = val.substring(0, start) + '\t' + val.substring(end);
				this.selectionStart = this.selectionEnd = start + 1;
				return false;
			}
		};
	}

	keystrokeHandler.enablePreview = function(editor) {
		editor.onkeyup = function () {
			hidden.value = translateJade();
		}
	}

	return keystrokeHandler;
}());
var JADE_PROCESSOR = (function() {
	var jadeProcessor = {};



	return jadeProcessor;
}());
var HTML_PROCESSOR = (function() {
	var htmlProcessor = {};



	return htmlProcessor;
}());
var MARKDOWN_PROCESSOR = (function() {
	var markdownProcessor = {};



	return markdownProcessor;
}());

/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */


var PROCESSOR = (function(processorType) {
	var processor = {
		html: HTML_PROCESSOR,
		jade: JADE_PROCESSOR,
		markdown: MARKDOWN_PROCESSOR
	};

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
/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

(function Main(EDITOR, EVENTS, KEYSTROKE_HANDLER) {
	var editorContainer = document.getElementById('jadedit');
	if (editorContainer.length) {
		document.write('Editor Container is not found.');
		return;
	}

	if (!editorContainer.hasAttribute('name')) {
		document.write('Editor does not have a name.');
		return;
	}

	editorContainer.innerHTML = EDITOR.getEditorTemplate(editorContainer.getAttribute('name'));

	var editorElements = {
		editorButton: document.getElementById('jadedit-editor-button'),
		previewButton: document.getElementById('jadedit-preview-button'),
		editor:  document.getElementById('jadedit-editor'),
		preview: document.getElementById('jadedit-preview'),
		hidden:  document.getElementById('jadedit-hidden')
	};

	EVENTS.registerEditorEvents(editorElements);
	KEYSTROKE_HANDLER.enableTab(editorElements.editor);
	KEYSTROKE_HANDLER.enablePreview(editorElements.editor);

	EVENTS.registerPreviewProcessor(editorElements.preview, 'jade');

}(EDITOR, EVENTS, KEYSTROKE_HANDLER));
