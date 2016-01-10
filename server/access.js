/* global Chats */

// Allow anything as long as the user is signed in.

Chats.allow({
  insert: function (userId, doc) {
    return !!userId;
  },

  update: function (userId, doc, fields, modifier) {
    return !!userId;
  },

  remove: function (userId, doc) {
    return !!userId;
  },

  fetch: []
});

// TODO: Isn't user data always autopublished?

Meteor.publish('Users', function () {
  return Meteor.users.find();
});

// Only return chats to or by the current user.

Meteor.publish('Chats', function () {
  var filter = {
    $or: [{
      user1Id: this.userId
    }, {
      user2Id: this.userId
    }]
  };
  return Chats.find(filter);
});

//end
