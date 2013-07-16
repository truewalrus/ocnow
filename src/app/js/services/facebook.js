/*Service for getting facebook login*/

'use strict';
angular.module('myApp.services')
.service('Facebook', ['$q', '$timeout', function($q, $timeout){

	//setting a variable for response from facebook
	this.fbResponse	= '';
	
	/**
	* Service method for logging into facebook. Facebook.login();
	*
	* @method login
	*/
	this.login = function(scope){
        console.debug("Logging into Facebook.");
        //$q.defer sets up an asynchronous promise
		var resp = $q.defer();

        //FB.login is Facebook's api login method, returns various information which is stored in resp
		FB.login(function(response) {
            scope.$safeApply(function() {
                console.debug(scope);
                resp.resolve(response.authResponse);
            });
            /*if (scope.$$phase) {
                resp.resolve(response.authResponse);
            }
            else {
                scope.$apply(function() {
                    resp.resolve(response.authResponse);
                });
            }*/

            FB.api('/me', function(response) {
                console.info("(Facebook) Logged in as %s", response.name);
            });

            console.debug("Facebook logged in.");
		});

        //set the variable for the response
		this.fbResponse = resp.promise;
	};
	
	this.logout = function(scope){
//$q.defer sets up an asynchronous promise
        console.debug("Logging out of Facebook.");
        var resp = $q.defer();

        //FB.login is Facebook's api login method, returns various information which is stored in resp
        FB.logout(function(response) {
            if (scope.$$phase) {
                resp.resolve(response.authResponse);
            }
            else {
                scope.$apply(function() {
                    resp.resolve(response.authResponse);
                });
            }

            console.debug("Facebook logged out.");
        });

        //set the variable for the response
        this.fbResponse = null;
	};
}]);

//Facebook necessary api methods
window.fbAsyncInit = function() {
	FB.init({
        //appId is obtained through Facebook's create an App setup. This will change per project
		appId: '281909378612016'
	});
};

// Load the Facebook SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));