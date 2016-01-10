/* global Avatars, Chats */

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
  },
  
  emoticonList: function () {

    var emoticons = [
      ':)', ':(', ':D', ':P', ':o', ':S', ':[', ';)', 'o_o', '8)'
    ];

    // A space must precede the emoticon or it will not be interpreted.

    return emoticons.reduce(function (str, emoticon) {
      return str +
        '<div class="emoticon-list-item" data-emoticon="' + emoticon + '">' +
          '<span class="emoticon-list-text">' +
            '&#' + emoticon.charCodeAt(0) + ';' + emoticon.substr(1) +
          '</span>' + 
          '<span class="emoticon-list-icon">' + 
            ' ' + emoticon +
          '</span>' +
        '</div>';
      }, 
      '');
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
  },
  
  'click .emoticon-list-item': function (event) {
    var emoticon = event.currentTarget.dataset.emoticon;
    
    if (emoticon)
      $('#chat').val($('#chat').val() + ' ' + emoticon);
  }
});

Template.profile.helpers({
  avatars: function () {
    return Avatars.find();
  }
});

Template.profile.events({
  'submit .js-save-profile': function (event) {
    event.preventDefault();
    console.log(event.target);

    if (Meteor.userId()) {
      console.log(event.target.inputName.value,
        event.target.inputAvatar.value,
        event.target.useName.checked,
        event.target.inputEmail.value);

      Meteor.call('updateProfile', Meteor.userId(), {
          name: event.target.inputName.value,
          avatar: event.target.inputAvatar.value,
          useName: event.target.useName.checked
        }
      );
      
      Meteor.call('updateEmail', event.target.inputEmail.value);
    }
  },

  // Save the avatar ID in a hidden control.

  'click .avatar-profile': function (event) {
    $('#inputAvatar').val(event.target.dataset.avatar);
  }
});

// Need to explicitly set focus. autofocus only works on page refresh.

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

// Return name from id, either .username or .profile.name depending
// on what's defined and user preference. If no user ID is given the 
// current user is assumed.

Template.registerHelper('getName', function (userId) {
  if (!userId)
    userId = Meteor.userId();
    
  var user = Meteor.users.findOne({ _id: userId });

  if (!user)  
    return 'Anon E. Mouse';
    
  if (user.profile.name && user.profile.useName)
    return user.profile.name;
    
  return user.username;
});

// Returns the name of the avatar image file. If no user ID is supplied,
// the current user is assumed.

Template.registerHelper('getAvatar', function (userId) {
  if (!userId)
    userId = Meteor.userId();
  
  var user = Meteor.users.findOne({ _id: userId });

  return Avatars.image(user ? user.profile.avatar: 0);
});
