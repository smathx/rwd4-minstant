Template.welcome.helpers({
  
  // Return some stats on the number of users, conversations and messages.
  
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
      Session.set('stats', result);
    });   
    
    var stats = Session.get('stats');
    
    if (!stats) {
      stats = {
        userCount: 0,
        chatCount: 0,
        messageCount: 0
      };
    }
    
    return 'There ' + are(stats.userCount) + ' currently ' 
      + one(stats.userCount, 'user')
      + ', ' + one(stats.chatCount, 'conversation')
      + ', and ' + one(stats.messageCount, 'message')
      + '.';
  }
});

Template.available_user_list.helpers({
  
  // Return list of all users except current.
  
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

//end
