/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
	'keyup header': function(event) {
		Meteor.call('insertPostData', this._id, 'header', $(event.target).text());
	},
	'keydown article': function(event) {
		// var containerElement = document.getElementById(Session.get('postId'));

		// Session.set('savedSel', rangy.getSelection().saveCharacterRanges(containerElement));
	},
	'keyup article': function(event) {
		// var containerElement = document.getElementById(Session.get('postId'));
		var htmlContent = $(event.target).html();
		var textContent = $(event.target).text();
		var contentBlocks = getContentBlocksFromBodyContent($(event.target));

		Meteor.call('insertPostData', this._id, 'body', htmlContent, contentBlocks);
		// rangy.getSelection().restoreCharacterRanges(containerElement, Session.get('savedSel'));
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
        console.log('WTF');
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
};

Template.Home.destroyed = function () {
};

/*****************************************************************************/
/* Home: Subscriptions */
/*****************************************************************************/
// Meteor.subscribe('thePosts');

function getContentBlocksFromBodyContent( $bodyContent ) {
	var contentBlocks = [];

	R.map( function ( index, contentBlock ) {
		contentBlocks.push(contentBlock.dataset.number);
	}, $bodyContent.children('.content-block'));

	return contentBlocks;
}