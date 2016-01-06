/* global Chats */

Meteor.methods({
  addChat: function (chat) {
    Chats.insert(chat);
  },
  
  addMessage: function (chatId, message) {
    Chats.update({ _id: chatId }, { $push: { messages: message } });
  }
});
