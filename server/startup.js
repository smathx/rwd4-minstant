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
      var avatar = 'ava0' + id + '.png';
      var name = 'User ' + id;

      console.log('Creating user/password ' + username + '/test123');

      var password = 'test123';

      Accounts.createUser({
        username: username,
        email: email,
        password: password,
        profile: {
          name: name,
          avatar: avatar
        }
      });
    }
  }
});
