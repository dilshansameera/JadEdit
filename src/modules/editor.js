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

	// Registers different events on the editor
	// ========================================

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
			editorElements.$sourceView.html(HIGHLIGHTER.highlight(editorElements.$hidden.val()));
		});
	}

	editor.registerCaretEvents = function (editorElements) {
		var timer = 0;
		var cursor = 0;

		editorElements.$editor
			.on("input keydown keyup propertychange click paste cut copy mousedown mouseup change",
			function () {
				clearTimeout(timer);
				timer = setTimeout(update, 10);
			});

		editorElements.$editor.keydown(function(e) {
			// Handling tab keys
			if (e.keyCode === 9) {
				var val = this.value,
					start = this.selectionStart,
					end = this.selectionEnd;

				this.value = val.substring(0, start) + '\t' + val.substring(end);
				this.selectionStart = this.selectionEnd = start + 1;
				return false;
			}
		});

		// Things need to happen when there is a focus to the editor
		// =========================================================

		function update() {

			// CaretOverlay is an overlay on top of the textarea used to calculate caret location
			// highlightOverlay is an overlay on top of the textarea used to display syntax highlighted code

			var editorContent = editorElements.$editor.val()

			HIGHLIGHTER.setCurrentHighlighter('jade');

			// Displaying highlighted code
			editorElements.highlightOverlay.innerHTML = HIGHLIGHTER.highlight(editorContent);
			// Generating overlay for caret location calculation
			editorElements.caretOverlay.innerHTML =
				editorElements
					.$editor.val()
					.substring(0, getCaretPosition(editorElements.$editor[0]))
					.replace(/\n$/, '\n\u0001');

			setCaretXY(editorElements.caretOverlay, editorElements.$editor[0],
				editorElements.$caret[0], getPos(editorElements.$editor));

			PROCESSOR.setCurrentProcessor('jade');
			editorElements.$hidden.val(PROCESSOR.process(editorContent));

			// Makes caret blink as if it's a real cursor
			editorElements.$caret.fadeIn(500).fadeOut(500).fadeIn(500);
			cursor = setInterval(function () {
				editorElements.$caret.fadeIn(500).fadeOut(500).fadeIn(500);
			}, 3000);
		}

		// Gets the position of the caret
		// ==============================

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

		// Sets the position of the caret
		// ==============================

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

		// Gets the relative position of the element
		// =========================================

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