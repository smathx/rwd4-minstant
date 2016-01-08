// Give new users a default name and avatar.

Accounts.onCreateUser(function (options, user) {
  if (!options.profile || !options.profile.name) {
    user.profile = {
      name: user.username,
      avatar: null,      
      useName: false
    };
  }
  else
    user.profile = options.profile;
  
  return user;
});

/* global Chats */

Meteor.methods({
  addChat: function (chat) {
    Chats.insert(chat);
  },

  addMessage: function (chatId, message) {
    Chats.update({
      _id: chatId
    }, {
      $push: {
        messages: message
      }
    });
  },

  stats: function () {
    return {
      userCount: Meteor.users.find().count(),
      chatCount: Chats.find().count()
        // TODO: Count signed in users      
        //    signedInCount: ????
    };
  },

  updateProfile: function (userId, profile) {
    Meteor.users.update({
      _id: userId
    }, {
      $set: {
        profile: profile
      }
    });
  },
  
  updateEmail: function (newEmail) {  
    var user = Meteor.user();
    
    if (user) {
      var oldEmail = null;
    
      if (user.emails) {
        oldEmail = user.emails[0].address;
        
        if (newEmail)    
          if (newEmail.toLowerCase() !== oldEmail.toLowerCase()) 
            Accounts.removeEmail(user._id, oldEmail);

        if (newEmail)
          Accounts.addEmail(user._id, newEmail);
      }
    }
  }
});
