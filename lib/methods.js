/* global Chats */

// Methods common to client and server.

Meteor.methods({
  addChat: function (chat) {
    Chats.insert(chat);
  },

  addMessage: function (chatId, message) {
    Chats.update({
      _id: chatId
    }, {
      $push: {
        messages: message
      }
    });
  },

  stats: function () {
    return {
      userCount: Meteor.users.find().count(),
      chatCount: Chats.find().count()
        // TODO: Count signed in users      
        //    signedInCount: ????
    };
  },

  updateProfile: function (userId, profile) {
    Meteor.users.update({
      _id: userId
    }, {
      $set: {
        profile: profile
      }
    });
  }
});
