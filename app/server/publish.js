Meteor.publish('thePosts', function() {
    var currentUserId = this.userId;

    return Posts.find({createdBy: currentUserId});
});

Meteor.publish('postInstructions', function(parentPostId, date) {
    return Instructions.find({
    	postId: parentPostId,
    	createdAt: {
    		$gte: date
    	}
    });
});

Meteor.publish('postsByUserBroadcast', function(name) {
	console.log(name);
	var user = Meteor.users.findOne({ username: name });

	return Posts.find({createdBy: user._id});
});

Meteor.publish('postsByUser', function(name) {
	console.log(name);
	var user = Meteor.users.findOne({ username: name });

	return Posts.find({createdBy: user._id});
});

Meteor.publish('view', function (/* args */) {
  return View.find();
});

Meteor.publish('theComments', function (parentPostId) {
	return Comments.find();
});

Meteor.publish('login', function (/* args */) {
  return Login.find();
});

Meteor.publish('landing', function (/* args */) {
  return Landing.find();
});