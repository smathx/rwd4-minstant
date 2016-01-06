/* global Router, Chats */

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('home', {
    to: 'main'
  });
});

Router.route('/chat/:_id', function () {
  
  // Redirect to home page if not signed in.
  
  if (!Meteor.userId()) {
    this.redirect('/');
    return;
  }
  
  // Find the most recent chat between the two users, regardless of order.
  
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
  
  var chatId;
  var chat = Chats.findOne(filter, { sort: [ 'createdAt', 'desc' ]});

  // Create a new one or update an old one.
  
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
  
  console.log(Chats.findOne({_id: chatId}));

  // Save the current chat ID and render page. Otherwise go back to main
  // page.
  
  if (chatId) {
    Session.set('chatId', chatId);

    this.render('chat_page', {
      to: 'main'
    });
  }
  else
    this.redirect('/');
});
