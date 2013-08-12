//Service for user login
'use strict';
angular.module("myApp.services")
    .service('user', ['$rootScope', '$http', function($rootScope, $http){

        $rootScope.user = false;
        $rootScope.loggedIn = false;

        var updateUserInfo = function(userInfo){
            $rootScope.user = userInfo;
            $rootScope.loggedIn = (userInfo !== null);
            $rootScope.$broadcast('userUpdated');
        };
/*        var setUser = function(data) {
            console.log(this, data);
            this.user = data;
        };*/

       // this.getUser = function() { return user; };
      //  this.isLoggedIn = function() { return loggedIn; };

        //signup
        this.signUp = function(username, password, success, error){
            $http.post('/api/user/create', {'username': username, 'password': password}).
                success(function(data) {
                    success(data);
                }).
                error(function(data) {
                    error(data);
                });
        };

        this.updateUser = function(_id, fName, lName, img, success, error){
            $http.post('/api/user/updateUser',{'_id':_id, 'fName':fName, 'lName':lName, 'img': img}).
                success(function(data){
                    updateUserInfo(data);
                    success(data);
                }).
                error(function(data){
                    error(data);
                });
        };

        //login -- email/display name, password,
        this.login = function(username, password, success, error){
            $http.post('/api/user/login', {'username': username, 'password': password}).
                success(function(data) {
                    $rootScope.$broadcast('userLoggedIn');
                    success(data);
                }).
                error(function(data) {
                    error(data);
                });

        };

        //Needs to be called in the header to get data every time
        this.checkSession = function(){
            $http.get('/api/user/checkSession').
                success(function(data) {
                    updateUserInfo(data);
                }).
                error(function(data) {
                    $rootScope.loggedIn = false;
                });

        };
		
		this.logout = function(success, error) {
			$http.get('/api/user/logout').
				success(function(data) {
                    $rootScope.user = false;
                    $rootScope.loggedIn = false;
					success(data);
				}).
				error(function(data) {
					error(data);
				});
		};
		
		
		this.deleteLoggedIn = function(success, error) {
			$http.get('/api/user/delete').
				success(function(data) {
					success(data);
				}).
				error(function(data) {
					error(data);
				});
		};

}]);
