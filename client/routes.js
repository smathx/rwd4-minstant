/* global Router */

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/about');

Router.route('/profile', function () {
  if (Meteor.userId())
    this.render('profile');
  else
    this.redirect('/');
});

Router.route('/chat/:_id', function () {

  // Should check otherUserId is valid but collection state is undefined
  // during page refresh so it will always redirect to home page.

  if (Meteor.userId()) {
    Session.set('otherUserId', this.params._id);
    this.render('chat_page');
  }
  else
    this.redirect('/');
});

// Everything else goes here.

Router.route('/(.*)', function () {
  this.render('notfound', {
    data: function () {
      return {
        url: Router.current().url
      };
    }
  });
});
