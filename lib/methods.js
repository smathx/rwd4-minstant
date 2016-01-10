/* global Chats */

// Methods common to client and server.

Meteor.methods({
  addChat: function (chat) {
    if (this.userId && chat)
      Chats.insert(chat);
  },

  removeChat: function (chatId) {
    if (this.userId && chatId)
      Chats.remove({ _id: chatId });
  },

  addMessage: function (chatId, message) {
    if (this.userId && chatId && message) {
      Chats.update({
        _id: chatId
      }, {
        $push: {
          messages: message
        }
      });
    }
  },

  updateProfile: function (userId, profile) {
    if (this.userId && profile) {
      Meteor.users.update({
        _id: userId
      }, {
        $set: {
          profile: profile
        }
      });
    }
  },
  
  // TODO: Only userCount is reactive.
  
  stats: function () {
    return {
      userCount: Meteor.users.find().count(),
      chatCount: Chats.find().count(),
      messageCount: Chats.find().fetch().reduce(function (sum, chat) {
        return sum + (chat.messages ? chat.messages.length: 0);
      }, 0)
      
  // TODO: Count signed in users      
  //  signedInCount: ????
    };
  }
});

//end
