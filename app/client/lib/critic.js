// editor
Critic = window.Critic || {};
Critic.editor = (function() {

	// Editor elements
	// var a, b, c, d, e...

	function init() {

		// Bind the editor elements to variables
		bindElements();

		// Create event listeners for keyup, mouseup, etc.
		createEventBindings();
	}

	function bindElements() {

		// a = document.querySelector( '.a' );
	}

	function createEventBindings() {

		// document.onmouseup = function(event) {

		// 	setTimeout( function() {
		// 		checkTextHighlighting(event)
		// 	}, 1);
		// }
	}

	function checkTextHighlighting(event) {

		var selection = window.getSelection();

		// If the user has selected text...
		if (selection.isCollapsed === false) {
			lastSelection = selection.getRangeAt(0);

			// this is the text node that contains
			// the text that the user has selected.
			var selectedNode = selection.focusNode;
			var selectedText = selection.toString();
			var selectedTextLength = selectedText.length;
			var selectedTextStartPosition = selectedNode.data.indexOf(selectedText);

			// We must split the text node so we can
			// encapsulate the text that we want to
			// highlight inside of a span element.
			var selectedTextNode = selectedNode.splitText(selectedTextStartPosition);

			// Split it again at the end of the selection
			selectedTextNode.splitText(selectedTextLength);

			// create a new span element that will
			// encapsulate the text to be highlighted
			spannode = document.createElement('span');
			spannode.className = 'highlight';
			spannode.appendChild(selectedTextNode.cloneNode(true));

			selectedTextNode.parentNode.replaceChild(spannode, selectedTextNode);

			lastHighlightedSpanNode = spannode;

			// Now we are going to create the comment box
			// var range = document.createRange();
			// range.selectNode(selectedTextNode);
			// var boundary = spannode.getBoundingClientRect();
			createCommentBox();
		}
	}

	function removeLastHighlight() {
		var text = new Text(lastHighlightedSpanNode.innerText);
		// var range = range.setStartBefore(lastHighlightedSpanNode);
		// range.insertNode(text);
		lastHighlightedSpanNode.parentNode.replaceChild(text, lastHighlightedSpanNode);
	}

	function rehighlightLastSelection() {
		var selection = window.getSelection().addRange( lastSelection );
	}

	function createCommentBox() {
		commentDivNode = document.createElement('div');
		commentDivNode.className = 'comment-box';
		commentDivNode.style.position = 'absolute';
		namePNode = document.createElement('p');
		namePNode.className = 'name';
		namePNode.innerText = 'Name';
		messageInputNode = document.createElement('input');
		messageInputNode.className = 'message';
		messageInputNode.setAttribute('placeholder', 'Leave a comment');
		messageInputNode.setAttribute('type', 'text');
		commentDivNode.appendChild(namePNode);
		commentDivNode.appendChild(messageInputNode);
		document.querySelector('.comment-column').appendChild(commentDivNode);

		boundary = spannode.getBoundingClientRect();
		commentDivNode.style.top = boundary.top - 5 + window.pageYOffset + "px";

		submitNode = document.createElement('i');
		submitNode.className = 'mdi-toggle-check-box submit-comment';
		commentDivNode.appendChild(submitNode);

		cancelSubmitNode = document.createElement('i');
		cancelSubmitNode.className = 'mdi-toggle-radio-button-on cancel-submit-comment';
		commentDivNode.appendChild(cancelSubmitNode);

	}

	return {
		init: init,
		rehighlight: rehighlightLastSelection,
		removeLastHighlight: removeLastHighlight
	}

})();
