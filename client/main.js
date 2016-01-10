/* global Avatars */

// Data subscriptions

Meteor.subscribe('Users');
Meteor.subscribe('Chats');


// Remove other user ID when user signs out.

Template._loginButtons.events({
  'click #login-buttons-logout': function (event) {
    Session.set('otherUserId', undefined);
    delete Session.keys.otherUserId;
  }
});

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

// Returns the other user ID if both users are defind.

Template.registerHelper('otherUserId', function () {
  return Meteor.userId() ? Session.get('otherUserId'): undefined;
});

//end
