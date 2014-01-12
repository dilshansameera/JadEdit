/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */

// The staring point of the applications. Initializes the components
// =================================================================

(function Main(EDITOR) {
	var $placeHolder = $("#jadedit");
	if (!$placeHolder.length && !$placeHolder.attr('name').length) {
		document.write('invalid config');
	}

	$placeHolder.html(EDITOR.getEditorTemplate($placeHolder.attr('name')));

	var editorElements = {
		$editorButton: $("#jadedit-editor-button"),
		$previewButton: $('#jadedit-preview-button'),
		$sourceButton: $('#jadedit-source-button'),
		$editorView: $('#jadedit-editor-view'),
		$editor: $('#jadedit-editor'),
		highlightOverlay: $('#jadedit-highlight-overlay')[0].firstChild,
		caretOverlay:  $('#jadedit-caret-overlay')[0].firstChild,
		$caret: $('#jadedit-caret'),
		$sourceView: $('#jadedit-source-view'),
		$previewView: $('#jadedit-preview-view'),
		$hidden: $('#jadedit-hidden')
	};

	EDITOR.registerCaretEvents(editorElements);
	EDITOR.registerEditorEvents(editorElements);
}(EDITOR));