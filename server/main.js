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

// These methods must be on the server. They invoke functions that
// do not run on the client.

Meteor.methods({
  updateEmail: function (newEmail) {  
    var user = Meteor.user();
    
    if (user) {
      var oldEmail;
    
      if (user.emails) {
        if (user.emails.length > 0) {
          oldEmail = user.emails[0].address;
        
          if (!newEmail || (newEmail.toLowerCase() !== oldEmail.toLowerCase())) 
            Accounts.removeEmail(user._id, oldEmail);
        }
        
        if (newEmail)
          Accounts.addEmail(user._id, newEmail);
      }
    }
  }
});

//end
