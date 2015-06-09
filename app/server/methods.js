/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
	'createInsertionInstruction': function(content, parentPostId, caretPosition, sessionNumber, insertionType) {
		var currentUserId = this.userId;
		console.log(parentPostId);
		console.log(caretPosition);

		Instructions.insert({
			action: {
				type: insertionType,
				data: content
			},
			postId: parentPostId,
			caretPosition: caretPosition,
			createdBy: currentUserId,
			createdAt: new Date().getTime(),
			sessionId: sessionNumber
		});
	},
	'createDeletionInstruction': function(lengthOfSelection, parentPostId, caretPosition, sessionNumber) {
		var currentUserId = this.userId;

		Instructions.insert({
			action: {
				type: 'deletion',
				data: lengthOfSelection
			},
			postId: parentPostId,
			createdBy: currentUserId,
			createdAt: new Date().getTime(),
			sessionId: sessionNumber
		});
	},
	'createComment': function(textData, parentPostId) {
		var currentUserId = this.userId;

		console.log('wa');
		console.log(textData);

		Comments.insert({
			postTextData: textData,
			postId: parentPostId,
			createdBy: currentUserId,
			createdAt: new Date().getTime()
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
		console.log(type);

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
