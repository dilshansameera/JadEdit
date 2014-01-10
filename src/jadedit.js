/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

// The staring point of the applications. Initializes the components
// =================================================================

(function Main(EDITOR, EVENTS, KEYSTROKE_HANDLER, PROCESSOR) {
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
		sourceButton: document.getElementById('jadedit-source-button'),
		editor:  document.getElementById('jadedit-editor'),
		source: document.getElementById('jadedit-source'),
		preview: document.getElementById('jadedit-preview'),
		hidden:  document.getElementById('jadedit-hidden')
	};

	EVENTS.registerEditorEvents(editorElements);
	KEYSTROKE_HANDLER.enableTab(editorElements);

	PROCESSOR.setCurrentProcessor('jade');
	KEYSTROKE_HANDLER.enablePreview(editorElements);

}(EDITOR, EVENTS, KEYSTROKE_HANDLER, PROCESSOR));