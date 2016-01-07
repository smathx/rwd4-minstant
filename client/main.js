/* global Chats */

Meteor.subscribe('Users');
Meteor.subscribe('Chats');

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
    
    Meteor.call('stats', function (error, result) {
      console.log(result);
      Session.set('stats', result);
    });   
    
    var stats = Session.get('stats');
    
    if (!stats) {
      stats = {
        userCount: 0,
        chatCount: 0
      };
    }
    
    return 'There ' + are(stats.userCount) + ' currently ' 
      + one(stats.userCount, 'user')
      + ' and ' + one(stats.chatCount, 'conversation') + '.';
  }
});

Template.available_user_list.helpers({
  users: function () {
    return Meteor.users.find({
      _id: {
        $ne: Meteor.userId()
      }
    }, {
      sort: ['username', 'asc']
    });
  }
});

Template.chat_page.helpers({
  messages: function () {
    var chat = getCurrentChat();
    return chat ? chat.messages: [];
  },
  otherUser: function () {
    return Meteor.users.findOne({ _id: Session.get('otherUserId') });
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
    
    var chat = getCurrentChat();

    if (!chat) {
      Meteor.call('addChat', {
        user1Id: Meteor.userId(),
        user2Id: Session.get('otherUserId'),
        messages: [ message ],
        createdAt: new Date()
      });
    }
    else {
      Meteor.call('addMessage', chat._id, message); 
    }
  }
});

Template.profile.helpers({
});

// Need to explicitly set focus otherwise autofocus only 
// works on page refresh.

Template.profile.onRendered(function () {
  $('[autofocus]').focus();
});

// Returns the most recent chat between current and other user, if any.

function getCurrentChat() {
  var author = Meteor.userId();
  var otherUserId = Session.get('otherUserId');

  var filter = {
    $or: [{
      user1Id: author,
      user2Id: otherUserId
    }, {
      user1Id: otherUserId,
      user2Id: author
    }]
  };
  return Chats.findOne(filter, { sort: ['createdAt', 'desc'] });
}

// Return username from id. This is not profile.name

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
