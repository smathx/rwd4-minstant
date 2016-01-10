/* global Avatars */

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

// Need to explicitly set focus. autofocus only seems to work on refresh.

Template.profile.onRendered(function () {
  $('[autofocus]').focus();
});

//end
