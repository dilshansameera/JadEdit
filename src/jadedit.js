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