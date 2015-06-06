/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
	'createComment': function(textData, parentPostId) {
		var currentUserId = this.userId;

		console.log('wa');
		console.log(textData);

		Comments.insert({
			postTextData: textData,
			postId: parentPostId,
			createdBy: currentUserId
		});
	},
	'createPost': function(headerContent, bodyContent, currentUserId) {
		// var currentUserId = this.userId;
		console.log(headerContent);
		console.log(bodyContent);

		Posts.insert({
			header: headerContent,
			body: bodyContent,
			contentBlocks: {},
			createdBy: currentUserId
		});
	},
	'insertPostData': function(postId, type, content, contentBlocks) {
		var currentUserId = this.userId;

		if (type == 'header') {
			Posts.update({
				_id: postId,
				createdBy: currentUserId
			},{
				$set: {
					header: content,
				}
			});
		} else {
			Posts.update({
				_id: postId,
				createdBy: currentUserId
			},{
				$set: {
					body: content,
				}
			});

			for (contentBlock in contentBlocks) {
				Posts.update({
					_id: postId,
					createdBy: currentUserId
				}, {
					$addToSet: {
						blocks: contentBlock
					}
				});
			}
		}
	},
	'deletePost': function(postId) {
		var currentUserId = this.userId;

		Posts.remove({
			_id: postId,
			createdBy: currentUserId
		});
	}
});
