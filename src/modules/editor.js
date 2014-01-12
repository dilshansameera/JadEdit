/* JadEdit - An embeddable JavaScript editor using Jade template syntax.
 * ===================================================================== */


var EDITOR = (function (PROCESSOR, HIGHLIGHTER) {
	var editor = {};

	// Returns a string value representing the editor template
	// =======================================================

	editor.getEditorTemplate = function (inputName) {
		return "<div id='jadedit-container'>" +
			"<div id='jadedit-button-controls'>" +
			"<div id='jadedit-editor-button' class='chosen'>Editor</div>" +
			"<div id='jadedit-source-button'>Source</div>" +
			"<div id='jadedit-preview-button'>Preview</div>" +
			"</div>" +
			"<div id='jadedit-editor-container'>" +
			"<div id='jadedit-editor-view'>" +
			"<div id='jadedit-highlight-overlay'><span spellcheck='false'></span></div>" +
			"<div id='jadedit-caret-overlay'><span spellcheck='false'></span></div>" +
			"<div id='jadedit-caret'></div>" +
			"<textarea id='jadedit-editor' spellcheck='false'></textarea>" +
			"</div>" +
			"<div id='jadedit-source-view' style='display: none;'></div>" +
			"<div id='jadedit-preview-view' style='display: none;'></div>" +
			"<input type='hidden' id='jadedit-hidden' name='" + inputName + "' />" +
			"</div>" +
			"</div>";
	}

	editor.registerEditorEvents = function (editorElements) {
		editorElements.$editorButton.click(function () {
			editorElements.$previewView.hide();
			editorElements.$editorView.show();
			editorElements.$sourceView.hide();
			editorElements.$editorButton.addClass('chosen');
			editorElements.$previewButton.removeClass('chosen');
			editorElements.$sourceButton.removeClass('chosen');
		});

		editorElements.$previewButton.click(function () {
			editorElements.$previewView.show();
			editorElements.$editorView.hide();
			editorElements.$sourceView.hide();
			editorElements.$editorButton.removeClass('chosen');
			editorElements.$previewButton.addClass('chosen');
			editorElements.$sourceButton.removeClass('chosen');

			PROCESSOR.setCurrentProcessor('jade');
			var result = PROCESSOR.process(editorElements.$editor.val());
			editorElements.$previewView.html(result);
		});

		editorElements.$sourceButton.click(function () {
			editorElements.$previewView.hide();
			editorElements.$editorView.hide();
			editorElements.$sourceView.show();
			editorElements.$editorButton.removeClass('chosen');
			editorElements.$previewButton.removeClass('chosen');
			editorElements.$sourceButton.addClass('chosen');

			HIGHLIGHTER.setCurrentHighlighter('html');
			PROCESSOR.setCurrentProcessor('jade');
			var result = PROCESSOR.process(editorElements.$editor.val());
			editorElements.$sourceView.html(HIGHLIGHTER.highlight(result));
		});
	}

	editor.registerCaretEvents = function (editorElements) {
		var timer = 0;
		editorElements.$editor
			.on("input keydown keyup propertychange click paste cut copy mousedown mouseup change",
			function () {
				clearTimeout(timer);
				timer = setTimeout(update, 10);
			});

		editorElements.$editor.keydown(function(e) {
			if (e.keyCode === 9) {
				var val = this.value,
					start = this.selectionStart,
					end = this.selectionEnd;

				this.value = val.substring(0, start) + '\t' + val.substring(end);
				this.selectionStart = this.selectionEnd = start + 1;
				return false;
			}
		});

		function update() {
			HIGHLIGHTER.setCurrentHighlighter('jade');
			editorElements.highlightOverlay.innerHTML = HIGHLIGHTER.highlight(editorElements.$editor.val());
			editorElements.caretOverlay.innerHTML =
				editorElements
					.$editor.val()
					.substring(0, getCaretPosition(editorElements.$editor[0]))
					.replace(/\n$/, '\n\u0001');

			setCaretXY(editorElements.caretOverlay, editorElements.$editor[0],
				editorElements.$caret[0], getPos(editorElements.$editor));

			editorElements.$caret.fadeIn(500).fadeOut(500).fadeIn(500);
			setInterval(function () {
				editorElements.$caret.fadeIn(500).fadeOut(500).fadeIn(500);
			}, 3000);
		}

		function getCaretPosition(el) {
			if (el.selectionStart) return el.selectionStart;
			else if (document.selection) {
				var r = document.selection.createRange();
				if (r == null) return 0;

				var re = el.createTextRange(), rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint('EndToStart', re);

				return rc.text.length;
			}
			return 0;
		}

		function setCaretXY(elem, real_element, caret, offset) {
			var rects = elem.getClientRects();
			var lastRect = rects[rects.length - 1];

			var x = lastRect.left + lastRect.width - offset[0] + document.documentElement.scrollLeft,
				y = lastRect.top - real_element.scrollTop - offset[1] + document.documentElement.scrollTop;

			// Setting the default position the cursor
			if (x == 0 && y == 0) {
				x = 10;
				y = 10;
			}

			caret.style.cssText = "top: " + y + "px; left: " + x + "px";
		}

		function getPos(element) {
			var e = element[0];
			var x = 0;
			var y = 0;
			while (e.offsetParent !== null) {
				x += e.offsetLeft;
				y += e.offsetTop;
				e = e.offsetParent;
			}
			return [x, y];
		}
	}

	return editor;
}(PROCESSOR, HIGHLIGHTER));