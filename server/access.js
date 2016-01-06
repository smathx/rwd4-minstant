/* global Chats */

Chats.allow({
  insert: function (userId, doc) {
    return !!userId;
  },

  update: function (userId, doc, fields, modifier) {
    return !!userId;
  },

  remove: function (userId, doc) {
    return false;
  },

  fetch: []
});

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
