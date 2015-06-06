/*****************************************************************************/
/* View: Event Handlers */
/*****************************************************************************/
Template.View.events({
	// 'submit': function (event) {
 //        event.preventDefault();

 //        Meteor.call('createPost', event.target.header.value, event.target.body.value);
 //    },
 //    'click #rehighlight': function (event) {
 //    	Critic.editor.rehighlight();
 //    },
 //    'click #removeLastHighlight': function (event) {
 //    	Critic.editor.removeLastHighlight();
 //    },
    // 'mouseup article': function (event) {
    // 	if (isCommenting) {
    // 		return;
    // 	}

    // 	checkTextHighlighting(event);

    // 	textSelection = document.getSelection();

    // 	if (textSelection.isCollapsed === false) {
    // 		// isCommenting = true;
    // 		// textRange = textSelection.getRangeAt(0);

    // 		selectedTextNode = getSelectedTextNode(event);

    // 		selectedTextNodeRange = document.createRange();
    // 		selectedTextNodeRange.setStartBefore(selectedTextNode);
    // 		selectedTextNodeRange.setEndAfter(selectedTextNode);

    // 		var selectedTextData = {
    // 			text: textSelection.toString(),
    // 			range: {
    // 				startOffset: selectedTextNodeRange.startOffset,
    // 				endOffset: selectedTextNodeRange.endOffset,
    // 			}
    // 		};

    // 		console.log(selectedTextData);

    // 		Meteor.call('createComment', selectedTextData, this._id);
    // 	}
    // },
    // 'mouseup .submit-comment': function (event) {
    // 	isCommenting = false;
    // },
    // 'mouseup .cancel-submit-comment': function (event) {
    // 	isCommenting = false;

    // 	textSelection = false;
    // 	textRange = false;
    // }
});

/*****************************************************************************/
/* View: Helpers */
/*****************************************************************************/
Template.View.helpers({
	'posts': function() {
		// console.log(Posts.findOne({}).createdBy);
		if (Meteor.userId()) {
			if (Meteor.userId() == Posts.findOne({}).createdBy) {
				console.log('we are here');
				return Posts.find({}, {reactive: false});
			}
		}

		return Posts.find();
	}
});

/*****************************************************************************/
/* View: Lifecycle Hooks */
/*****************************************************************************/
Template.View.created = function () {
};

Template.View.rendered = function () {
	Critic.editor.init();
};

Template.View.destroyed = function () {
};

/*****************************************************************************/
/* Spectator: Subscriptions */
/*****************************************************************************/

var isCommenting = false;

function cmonMan(textData) {
	console.log(textData);
}

function getSelectedTextNode(event) {
	var selection = window.getSelection();

	if (selection.isCollapsed === false) {
		lastSelectionRange = selection.getRangeAt(0);

		var selectedNode = selection.focusNode;
		var selectedText = selection.toString();
		var selectedTextLength = selectedText.length;
		var selectedTextStartPosition = selectedNode.data.indexOf(selectedText);

		var selectedTextNode = selectedNode.splitText(selectedTextStartPosition);

		selectedTextNode.splitText(selectedTextLength);

		return selectedTextNode;
	}
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

function createCommentBox() {
	commentDivNode = document.createElement('div');
	commentDivNode.className = 'comment-box';
	commentDivNode.style.position = 'absolute';

	namePNode = document.createElement('p');
	namePNode.className = 'name';
	namePNode.innerText = Meteor.user().profile.name;

	messageInputNode = document.createElement('textarea');
	messageInputNode.className = 'materialize-textarea message';
	messageInputNode.setAttribute('placeholder', 'Leave a comment');

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

function getContentBlocksFromBodyContent( $bodyContent ) {
	var contentBlocks = [];

	R.map( function ( index, contentBlock ) {
		contentBlocks.push(contentBlock.dataset.number);
	}, $bodyContent.children('.content-block'));

	return contentBlocks;
}