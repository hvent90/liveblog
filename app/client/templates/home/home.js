/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
	'keyup header': function(event) {
		Meteor.call('insertPostData', this._id, 'header', $(event.target).text());
	},
	// 'keydown article': function(event) {
	// 	// var containerElement = document.getElementById(Session.get('postId'));

	// 	// Session.set('savedSel', rangy.getSelection().saveCharacterRanges(containerElement));
	// },
	// 'keyup article': function(event, t) {
	// 	var text = t.$(event.currentTarget).html();
 //    	t.$('#content-input').val(text).trigger('input');
	// 	// var containerElement = document.getElementById(Session.get('postId'));

	// 	var htmlContent = $(event.target).html();
	// 	var textContent = $(event.target).text();
	// 	var contentBlocks = getContentBlocksFromBodyContent($(event.target));

	// 	Meteor.call('insertPostData', this._id, 'body', htmlContent, contentBlocks);
	// 	// rangy.getSelection().restoreCharacterRanges(containerElement, Session.get('savedSel'));
	// },
	// 'keypress article': function(event) {
	// 	var caretPosition = getCaretPositionIn(content);
	// 	var selection = window.getSelection();

	// 	handleEvent(event, selection, caretPosition);

	// 	// console.log(selection.focusNode.data[selection.focusOffset]);
	// 	// console.log(selection.focusOffset);
	// 	// console.log(selection.focusNode.parentNode);
	// },
	'keypress article': function(event) {
		var caretPosition = getCaretPositionIn(content);
		var selection = window.getSelection();

		handleEvent(event, selection, caretPosition, this._id);
	},
	'keydown article': function(event) {
		var caretPosition = getCaretPositionIn(content);
		var selection = window.getSelection();

		if (event.keyCode === 8) {
			handleEvent(event, selection, caretPosition, this._id);
		}
	},
	'keyup article': function(event) {
		// var containerElement = document.getElementById(Session.get('postId'));
		var htmlContent = $(event.target).html();
		var textContent = $(event.target).text();
		var contentBlocks = getContentBlocksFromBodyContent($(event.target));

		Meteor.call('insertPostData', this._id, 'body', htmlContent, contentBlocks);
		// rangy.getSelection().restoreCharacterRanges(containerElement, Session.get('savedSel'));
	},
	'paste': function(e) {
		var i = 0;
		while (i < e.originalEvent.clipboardData.types.length) {
            var key = e.originalEvent.clipboardData.types[i];
            var val = e.originalEvent.clipboardData.getData(key);
            console.log((i + 1) + ': ' + key + ' - ' + val);
            i++;
        }

        var caretPosition = getCaretPositionIn(content);
		var selection = window.getSelection();

		getDocumentFragmentFromHtmlString(event.clipboardData.getData('text/html'));

		handleEvent(event, selection, caretPosition, this._id);
	},
	'click article': function(event) {
		Session.set('postId', this._id);
	},
	'click .ui-inputs': function(event) {
		var postId = Session.get('postId');
		var htmlContent = $('#'+postId).html();

		Meteor.call('insertPostData', postId, 'body', htmlContent);
	},
	'click input[type=submit]': function(event) {
		event.preventDefault();

		Meteor.call('deletePost', this._id);
	},
	'submit': function (event) {
        // event.preventDefault();
        // var playerNameVar = event.target.playerName.value;

        // Meteor.call('insertPlayerData', playerNameVar);
    }
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
	'posts': function() {
		return Posts.find({}, {reactive: false});
	},
	'post': function() {
		return Posts.findOne({}, {reactive: false});
	},
	'instructions': function() {
		return Instructions.find();
	}
});

Template.Home.rendered = function() {
	// ZenPen.editor.init();
	// ZenPen.ui.init();
}

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.created = function () {
};

Template.Home.rendered = function () {
	content = document.querySelector(".content");
	header = document.querySelector('.header');

	// instructionsDep = new Deps.Dependency;
	// var handle = Deps.autorun(function () {
	// 	console.log("Boom");
	// });

	var post = Posts.findOne();
	Meteor.subscribe('postInstructions', post._id, new Date().getTime());
};

Template.Home.destroyed = function () {
};

/*****************************************************************************/
/* Home: Subscriptions */
/*****************************************************************************/
// Meteor.subscribe('thePosts');

sessionNumber = Math.random();

setTimeout(function() {
	Tracker.autorun(function () {
		var instructions = Instructions.find().fetch();
		var instruction = instructions[instructions.length - 1];

		if (instruction) {
			handleInstruction(instruction);
		}
	});
}, 1000);

function handleInstruction(instruction) {
	// Prevent the instruction from
	// running on the local machine
	if (instruction.sessionId == sessionNumber) {
		return;
	}

	var content = document.querySelector('.content');
	var text = content.firstChild,
		childNodes = content.childNodes,
		amountOfChildNodes = childNodes.length,
		insertionContent;

	// join all adjacent text nodes together
	content.normalize();


	if (instruction.action.type == 'paste') {
		insertionContent = getDocumentFragmentFromHtmlString(instruction.action.data);
	} else {
		insertionContent = new Text(instruction.action.data);
	}

	loopThroughChildNodes(childNodes, instruction.caretPosition, insertionContent);
}

function loopThroughChildNodes(childNodes, caretPosition, insertionContent) {
	var amountOfChildNodes = childNodes.length;

	for (var i = 0; i < amountOfChildNodes; i++) {
		// Make sure the node is of type text node
		if (childNodes[i].childNodes > 0) {
			loopThroughChildNodes(childNodes[i].childNodes, caretPosition, insertionContent)
		} else {
			if (childNodes[i].length < caretPosition) {
				caretPosition -= childNodes[i].length;
			} else {
				console.log(childNodes[i].nodeType);
				insertInstruction(childNodes[i], caretPosition, insertionContent)

				return true;
			}
		}
	}
}

function getDocumentFragmentFromHtmlString(htmlString) {
	// We will eventually return documentFragment
	var documentFragment = document.createDocumentFragment(),
		// tmp is a temporary element and we will set its
		// innerHTML to the htmlString
		tmp = document.createElement('body'),
		// child is used for looping purposes later on
		child;

	// We set tmp's innerHTML to the HTML string.
	tmp.innerHTML = htmlString;

	while (child = tmp.firstChild) {
		documentFragment.appendChild(child);
	}

	console.log(documentFragment);
}

function insertInstruction(node, offset, content) {
	node.splitText(offset);
	var range = new Range();
	range.setStartAfter(node);
	range.insertNode(content);
}

function getContentBlocksFromBodyContent( $bodyContent ) {
	var contentBlocks = [];

	R.map( function ( index, contentBlock ) {
		contentBlocks.push(contentBlock.dataset.number);
	}, $bodyContent.children('.content-block'));

	return contentBlocks;
}

function getCaretPositionIn(parentElement) {
	var selection = window.getSelection();
	console.log(selection);
	var range = selection.getRangeAt(0);
	var preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(parentElement);
	preCaretRange.setEnd(range.endContainer, range.startOffset);
	console.log(preCaretRange.toString());

	return preCaretRange.toString().length;
}

function handleEvent(event, selection, caretPosition, postId) {
	var eventData = getTypeOfEvent(event, selection);

	if (!eventData) {
		return;
	}

	if (!selection.isCollapsed) {
		var lengthOfSelection = selection.getRangeAt(0).toString().length;
		// delete for length of selection starting at caretPosition
		Meteor.call('createDeleteInstruction', lengthOfSelection, this._id, caretPosition, sessionNumber);
	}

	if (eventData.type == 'delete') {
		console.log('deletion');
		// delete for 1 starting at caretPosition
		Meteor.call('createDeletionInstruction', 1, this._id, caretPosition, sessionNumber);

	} else if (eventData.type == 'character') {
		console.log('character');
		// insert character starting at caretPosition
		Meteor.call('createInsertionInstruction', eventData.data, postId, caretPosition, sessionNumber, 'insertion');

	} else if (eventData.type == 'paste') {
		console.log('paste');
		// paste contents starting at caretPosition
		Meteor.call('createInsertionInstruction', eventData.data, postId, caretPosition, sessionNumber, 'paste');

	} else {
		console.log("I've made a huge mistake.");
	}
}

function getTypeOfEvent(event, selection) {
	var eventData = {};

	if (event.keyCode == 8) {
		eventData.type = 'delete';

		return eventData;
	}

	if (event.originalEvent) {
		if (event.originalEvent.clipboardData) {
			eventData.type = 'paste';
			eventData.data = event.originalEvent.clipboardData.getData('text/html');

			return eventData;
		}
	} else {
		if (event.clipboardData) {
			eventData.type = 'paste';
			eventData.data = event.clipboardData.getData('text/html');

			return eventData;
		}
	}

	if (String.fromCharCode(event.keyCode)) {
		eventData.type = 'character';
		eventData.data = String.fromCharCode(event.keyCode);
		console.log(eventData);

		return eventData;
	}

	return false;
}