/* global Chats */

Template.chat_page.helpers({
  
  // TODO: put most recent first maybe better.
  
  messages: function () {
    var chat = getCurrentChat();
    return chat ? chat.messages: [];
  },
  
  otherUser: function () {
    return Meteor.users.findOne({ _id: Session.get('otherUserId') });
  },
  
  // Returns fiddly HTML for emoticon strip.
  
  emoticonList: function () {

    // This is a subset of the full list:
    // https://github.com/dubvfan87/meteor-emoticons/blob/master/meteor-emoticons.coffee
    
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
  
  // Send message.
  
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

  // Clear all messages.
  
  'click #clear': function (event) {
    var chat = getCurrentChat();
    
    if (chat)
      Meteor.call('removeChat', chat._id);
  },
  
  // Insert emoticon sequence into text message.
  
  'click .emoticon-list-item': function (event) {
    //var emoticon = event.currentTarget.dataset.emoticon;
    var target = $(event.currentTarget);
    var emoticon = target.attr('data-emoticon');

    if (emoticon)
      $('#chat').val($('#chat').val() + ' ' + emoticon);
  }
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

//end
