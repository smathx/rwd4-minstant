/* global Chats */

Meteor.startup(function () {

  var cleanDB = true;

  // Clean out DB for testing - quicker than reset.

  if (cleanDB) {
    console.log('Scrubbing database...');
    Meteor.users.remove({});
    Chats.remove({});
  }

  if (!Meteor.users.findOne()) {
    for (var id = 1; id <= 8; id += 1) {
      var username = 'user' + id;
      var email = 'user' + id + '@test.com';
      var password = 'test123';
      var avatar = 1 + id * 5;

      console.log('Creating user/password ' + username + '/' + password);

      Accounts.createUser({
        username: username,
        email: email,
        password: password,
        profile: {
          name: username,
          avatar: avatar,
          useName: false
        }
      });
    }
  }
});
