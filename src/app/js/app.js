'use strict';


// Declare app level module which depends on filters, and services

var app = angular.module('myApp', ['myApp.filters', 'myApp.directives', 'myApp.services', 'myApp.controllers', 'ngCookies']);
 app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	// angular front end routes
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
	$routeProvider.when('/sign-in', {templateUrl: 'partials/sign-in.html'});
    $routeProvider.otherwise({redirectTo: '/view1'});
	
	// fix to remove '#' from url strings in browser
	/*
		IE 10 is oldest IE that html5mode will work on
	*/
	$locationProvider.html5Mode(true);
  }]);

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
}]);

//These need to be defined here in order for the module names to be succesfully reused
//All non-3rd party modules should be defined as angular.module('myApp.[type]').[type]
angular.module('myApp.services', []);
angular.module('myApp.filters', []);
angular.module('myApp.directives',[]);
angular.module('myApp.controllers', []);
