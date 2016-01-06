/* global Router */

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('home', {
    to: 'main'
  });
});

Router.route('/chat/:_id', function () {
  
  // Should check otherUserId is valid but collection state is undefined
  // during page refresh so it will redirect to home page.
  
  if (Meteor.userId()) { 
    Session.set('otherUserId', this.params._id);
    this.render('chat_page', { to: 'main' });
  }
  else
    this.redirect('/');
});
