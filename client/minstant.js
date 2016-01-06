/* global Chats */

Template.welcome.helpers({
  statusMessage: function () {
    
    function one(num, singular, plural) {
      if (!plural)
        plural = singular + 's';
        
      if (num == 0)
        num = 'no';
        
      return num + ' ' + ((num == 1) ? singular: plural);
    }
    
    function are(num) {
      return (num == 1) ? 'is': 'are';
    }
    
    var user_count = Meteor.users.find().count();   
    var chat_count = Chats.find().count();   
    
    return 'There ' + are(user_count) + ' currently ' 
      + one(user_count, 'user')
      + ' and ' + one(chat_count, 'conversation') + '.';
  }
});

Template.available_user_list.helpers({
  users: function () {
    return Meteor.users.find({}, { sort: [ 'username', 'asc' ] });
  }
});

Template.available_user.helpers({
  isMyUser: function (userId) {
    return userId == Meteor.userId();
  }
});

Template.chat_page.helpers({
  messages: function () {
    console.log(Session.get('chatId'));
    var chat = Chats.findOne({ _id: Session.get('chatId') });
    return chat.messages;
  },
  otherUser: function () {
    var chat = Chats.findOne({ _id: Session.get('chatId') });
    var otherUserId = chat.user1Id;
    
    if (otherUserId == Meteor.userId())
      otherUserId = chat.user2Id;
    
    return Meteor.users.findOne({ _id: otherUserId });
  }
});

Template.chat_page.events({
  'submit .js-send-chat': function (event) {
    event.preventDefault();

    var message = {
      text: event.target.chat.value,
      author: Meteor.userId(),
      createdAt: new Date()
    };

    event.target.chat.value = '';

    //    var chat = Chats.findOne({ _id: Session.get('chatId') });
    //    
    //    if (chat) {
    //      Chats.update(chat._id, { $push: { messages: message }});

    Chats.update({ _id: Session.get('chatId') }, 
                 { $push: { messages: message } });
  }
});

//----------------------------------------------------------------------------

Template.registerHelper('getCurrentUsername', function (userId) {
  var user = Meteor.userId({ _id: userId });
  return user ? user.username : 'Anon E Mouse';
});

Template.registerHelper('getUsername', function (userId) {
  var user = Meteor.users.findOne({ _id: userId });
  return user ? user.username : 'Anon E Mouse';
});

// Returns the name of the avatar image file. If no user ID is supplied,
// the current user is assumed.

Template.registerHelper('getAvatar', function (userId) {
  if (!userId)
    userId = Meteor.userId();
  
  var user = Meteor.users.findOne({ _id: userId });
  
  if (!user)
    return '/unknown.png';
  
  if (!user.profile.avatar)
    return '/default-user.png';
  
  return '/' + user.profile.avatar;
});
