/* global Router, Chats */

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render("lobby_page", {
    to: "main"
  });
});

Router.route('/chat/:_id', function () {
  var otherUserId = this.params._id;
  
  var filter = {
    $or: [{
      user1Id: Meteor.userId(),
      user2Id: otherUserId
    }, {
      user1Id: otherUserId,
      user2Id: Meteor.userId()
    }]
  };
  
  console.log(filter);
  
  var chatId;
  var chat = Chats.findOne(filter, { sort: [ 'createdAt', 'desc' ]});
  
  if (!chat) { 
    console.log("Creating new chat");
    chatId = Chats.insert({
      user1Id: Meteor.userId(),
      user2Id: otherUserId,
      messages: [],
      createdAt: new Date()
    });
  }
  else { 
    console.log("Updating old chat");
    chatId = chat._id;
  }
  
  console.log(" chatId: " + chatId);
  console.log("user1Id: " + Meteor.userId());
  console.log("user2Id: " + otherUserId);
  
  if (chatId) {
    Session.set('chatId', chatId);
  }
  
  this.render('chat_page', {
    to: 'main'
  });
});
