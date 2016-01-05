/* global Chats */

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
    
    var chat = Chats.findOne({ _id: Session.get('chatId') });
    
    if (chat) {
      chat.messages.push({
        text: event.target.chat.value,
        author: Meteor.userId(),
        createdAt: new Date()
      });

      event.target.chat.value = '';

      Chats.update(chat._id, chat);
    }
  }
});

//----------------------------------------------------------------------------

// formatDate should convert a Date object to a reasonable date string
// numeric day, month string, and 4 digit year. The order, language and
// separators depend on the user locale. For example, the fifth day of the
// twelfth month in 2015 in the locale 'en-GB' returns '5 December 2015'.

Template.registerHelper('formatDate', function (datetime) {
  // Gives a valid locale but not necessarily the right one
  var locale = navigator.language ||      // Chrome, Firefox, IE >= 11
               navigator.userLanguage ||  // IE <= 10
               navigator.browserLanguage; // IE <= 10

  // Should always be defined but fail gracefully if not.
  if (!datetime)
    return '<Date undefined>';

  if (!locale)
    return datetime.toLocaleDateString();

  var options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return datetime.toLocaleDateString(locale, options);
});

Template.registerHelper('getCurrentUsername', function (userId) {
  var user = Meteor.userId({ _id: userId });
  return user ? user.username : 'Anon E Mouse';
});

Template.registerHelper('getUsername', function (userId) {
  var user = Meteor.users.findOne({ _id: userId });
  return user ? user.username : 'Anon E Mouse';
});

Template.registerHelper('getAvatar', function (userId) {
  var user = Meteor.users.findOne({ _id: userId });
  return user ? '/' + user.profile.avatar : '/unknown.png';
});
