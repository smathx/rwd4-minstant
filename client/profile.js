/* global Avatars, getAvatar */

Template.profile.helpers({
  avatars: function () {
    return Avatars.find();
  }
});

Template.profile.events({
  'submit .js-save-profile': function (event) {
    event.preventDefault();

    if (Meteor.userId()) {
      Meteor.call('updateProfile', Meteor.userId(), {
          name: event.target.inputName.value,
          avatar: event.target.inputAvatar.value,
          useName: event.target.useName.checked
        }
      );
      
      Meteor.call('updateEmail', event.target.inputEmail.value);
    }
  },

  // Display new avatar and save ID to a hidden control.

  'click .avatar-profile': function (event) {
    // Modern browsers can use: avatar = event.target.dataset.avatar
    var target = $(event.target);
    var avatar = target.attr('data-avatar');
    $('#main-avatar').attr('src', Avatars.image(avatar));
    $('#inputAvatar').val(avatar);
  }
  
});

// Need to explicitly set focus. autofocus only seems to work on refresh.

Template.profile.onRendered(function () {
  $('[autofocus]').focus();
});

//end
