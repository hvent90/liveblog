Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

// Router.route('/:name/broadcast', {
//   name: 'home',
//   controller: 'HomeController',
//   action: 'action',
//   where: 'client',
//   waitOn: function(){
//     // waitOn makes sure that this publication is ready before rendering your template
//     // return [
//     //   Meteor.subscribe("thePosts"),
//     //   Meteor.subscribe("theComments")
//     // ];
//     return Meteor.subscribe("postsByUserBroadcast", this.params.name);
//   },
// });

Router.route('/:name', {
  name: 'view',
  controller: 'ViewController',
  action: function() {
    if (Meteor.userId()) {
        if (this.params.name == Meteor.user().username) {
            this.render('Home');
        } else {
          this.render('View');
        }
    } else {

      this.render('View');
    }

  },
  where: 'client',
  waitOn: function(){
    if (Meteor.userId()) {
        if (this.params.name == Meteor.user().username) {
            return Meteor.subscribe("postsByUserBroadcast", this.params.name);
        } else {
          return Meteor.subscribe("postsByUser", this.params.name);
        }
    } else {

      return Meteor.subscribe("postsByUser", this.params.name);
    }
  }
});

Router.route('login', {
  name: 'login',
  controller: 'LoginController',
  action: 'action',
  where: 'client'
});

Router.route('/', {
  name: 'landing',
  controller: 'LandingController',
  action: 'action',
  where: 'client'
});