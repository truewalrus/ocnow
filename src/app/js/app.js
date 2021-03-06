'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('myApp', ['myApp.filters', 'myApp.directives', 'myApp.services', 'myApp.controllers', 'ngCookies', 'ui.bootstrap', 'ui.scrollfix', 'ui.route']);
 app.config(['$routeProvider', '$locationProvider', 'pageProvider', 'GoogleApiProvider', function($routeProvider, $locationProvider, pageProvider, GoogleApiProvider) {

	// angular front end routes
	$routeProvider.when('/sign-in', {templateUrl: '/partials/sign-in.html'});
    $routeProvider.when('/contact-us', {templateUrl:'/partials/contact-us.html'});
    $routeProvider.when('/home', {templateUrl: '/partials/home.html'});
    $routeProvider.when('/new-post', {templateUrl: '/partials/new-post.html'});
    $routeProvider.when('/profile', {templateUrl: '/partials/profile.html'});
    $routeProvider.when('/user/:id', {templateUrl: '/partials/view-profile.html'});
    $routeProvider.when('/new-vid', {templateUrl: '/partials/new-vid.html'});
    $routeProvider.when('/article/:_id/edit', {templateUrl:"/partials/edit-post.html"});
    $routeProvider.when('/article/:id', {templateUrl:"/partials/view-post.html"});
    $routeProvider.when('/episode/:id', {templateUrl:"/partials/view-video.html"});
    $routeProvider.when('/search', {templateUrl: "/partials/search.html"});
    $routeProvider.when('/news', {templateUrl: "/partials/news.html"});
    $routeProvider.when('/episodes', {templateUrl: "/partials/episodes.html"});
    $routeProvider.when('/pwreset/:resetCode', {templateUrl: "/partials/pwreset.html"});
    $routeProvider.otherwise({redirectTo: '/home'});
	
	// fix to remove '#' from url strings in browser
	/*
		IE 10 is oldest IE that html5mode will work on
	*/
	$locationProvider.html5Mode(true);

     // Set the base site name for the title-change service.
    pageProvider.setSiteName('My OC Now');

     GoogleApiProvider.setApiKey('AIzaSyAR61gl3uKPz59viYfdfvWvbM_44dG8UG0');
  }]);

//angular.module('myApp.services', []).config(['pageProvider', function(pageProvider) {
//    console.log("Inside configuration");
//    console.log(pageProvider);
//    pageProvider.setSiteName('My OC Now');
//}]);



app.run(['$rootScope', function($rootScope) {
    $rootScope.$safeApply = function(fn) {
        fn = fn || function() {};
        if(this.$$phase) {
            fn();
        }
        else {
            this.$apply(fn);
        }
    };

    $rootScope.loading = false;

    $rootScope.profilePic = function(image) {
        //return image ? '/img/' + image : '';
        return image ? "https://s3-us-west-1.amazonaws.com/trurektestbucket/" + image : '';
    };

    $rootScope.articlePic = function(image) {
        //return image ? '/img/' + image : '';
        return image ? "https://s3-us-west-1.amazonaws.com/trurektestbucket/" + image : '';
    };
}]);

//These need to be defined here in order for the module names to be successfully reused
//All non-3rd party modules should be defined as angular.module('myApp.[type]').[type]
angular.module('myApp.services', []);
angular.module('myApp.filters', []);
angular.module('myApp.directives',[]);
angular.module('myApp.controllers', []);
