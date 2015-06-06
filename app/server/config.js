Accounts.onCreateUser(function(options, user) {
	Meteor.call('createPost', 'Welcome to your new journal.', '<p>Start typing!</p>', user._id);


	return user;
});