//Service for user login
'use strict';
angular.module("myApp.services")
    .service('user', ['$rootScope', '$http', 'uploadService', function($rootScope, $http, upload){

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
        this.signUp = function(username, password, rank, fName, lName, challenge, response, success, error, email){
            $http.post('/api/user/create', {'username': username, 'password': password, 'fName': fName, 'lName': lName, 'rank': rank, 'recaptcha_challenge_field':challenge, 'recaptcha_response_field':response, 'email': email}).
                success(function(data) {
                    success(data);
                }).
                error(function(data) {
                    error(data);
                });
        };

        this.updateUser = function(_id, fName, lName, img, success, error){
//            $http.post('/api/user/updateUser',{'_id':_id, 'fName':fName, 'lName':lName, 'img': img}).
//                success(function(data){
//                    updateUserInfo(data);
//                    success(data);
//                }).
//                error(function(data){
//                    error(data);
//                });

            var userInfo = {'fName': fName, 'lName': lName};

 //           console.log("(user.js) Updating user...", userInfo);

//            console.log("img: ", img);

            upload.upload('/api/user/update/' + _id, userInfo, img, function(response) {
                if ($rootScope.user._id == _id) { updateUserInfo(response); }

                success(response);
            }, error);
        };

        this.saveEmail = function(_id, email, success, error){
            $http.post('/api/user/saveEmail', {_id: _id, email: email}).
                success(function(data){
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
                    console.log(data);
                    success(data);
                }).
                error(function(data) {
                    console.log(data);
                    error(data);
                });

        };

        //Needs to be called in the header to get data every time
        this.checkSession = function(){
            $rootScope.checkingSession = true;
            console.log($rootScope.checkingSession);

            $http.get('/api/user/checkSession').
                success(function(data) {
                    updateUserInfo(data);
                    $rootScope.checkingSession = false;
                }).
                error(function(data) {
                    $rootScope.loggedIn = false;
                    $rootScope.checkingSession = false;
                    $rootScope.$broadcast("user:loggedOut");
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

        this.deleteUser = function(_id, success, error){
            $http.post('/api/user/delete', {'_id': _id}).
                success(function(data){
                    if(_id === $rootScope.user._id){
                        $rootScope.user = false;
                        $rootScope.loggedIn = false;
                    }
                    success(data);
                }).
                error(function(data){
                    error(data);
                });
        };

        this.changePassword = function(_id, oldPW, newPW, success, error){
            $http.post('/api/user/changePassword', {'_id':_id, 'password':oldPW, 'newPassword': newPW}).
                success(function(data){
                    success(data);
                }).
                error(function(data){
                    error(data);
                });
        };

        this.parseName = function(user) {
            var name = ((user.fName || ' ') + ' ' + (user.lName || ' ')).trim();

            if (!name || name === '') {
                return user.username;
            }

            return name;
        };
		
		/*this.deleteLoggedIn = function(success, error) {
			$http.get('/api/user/delete').
				success(function(data) {
					success(data);
				}).
				error(function(data) {
					error(data);
				});
		};*/

}]);
