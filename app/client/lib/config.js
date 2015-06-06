Meteor.startup(function () {
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Accounts.onLogin(function() {

	if (Router.current().route._path == '' || Router.current().route._path == '/') {
		Router.go('/' + Meteor.user().username);
	}
});