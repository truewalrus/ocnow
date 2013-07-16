'use strict';

angular.module("myApp.controllers").controller('SignInCtrl', ['$scope','user', function($scope, iUser){
	
	$scope.signingIn = true;
	$scope.userName = '';
	$scope.user = {};
	$scope.loggedIn = false;

    $scope.$on('userLoggedIn', function() {
        $scope.loggedIn = true;
        $scope.userName = iUser.getUser().username;
        console.log(iUser.getUser());
    });
	
	var clearUser = function(clearPassOnly) {
		if (clearPassOnly) {
			$scope.user.pw = '';
		}
		else {
			$scope.user = {};
		}
	};
	
	var clearErrMsg = function() {
		$scope.errMsg = null;
	};
	
	var checkSession = function() {
		iUser.checkSession(
			function(data) {
				$scope.loggedIn = true;
				$scope.userName = data.username;
			},
			function(data) {
				$scope.loggedIn = false;
			}
		);
	};
	checkSession();
	
	$scope.showSignIn = function() {
		clearErrMsg();
		$scope.signingIn = true;
		
		console.log('sign in true');
		
		clearUser();
	};
	
	$scope.showSignUp = function() {
		clearErrMsg();
		$scope.signingIn = false;
		
		console.log('sign in false');
		
		clearUser();
	};
	
	$scope.signIn = function() {
		clearErrMsg();
		console.log('%cSigning In', "color: red;font-weight:bold;");
		console.log('- Username: ' + $scope.user.username);
		console.log('- Password: ' + $scope.user.pw);
		
		iUser.login($scope.user.username, $scope.user.pw, function(data) {
			console.log('logged in!');
			$scope.loggedIn = true;
			$scope.userName = data.username;
			clearUser();
		},
		function(data) {
			console.log('login failed!');
			$scope.errMsg = data;
			clearUser(true);
		});
	};
	
	$scope.signUp = function() {
		clearErrMsg();
		console.warn('signUp');
		console.log('username: ' + $scope.user.username);
		console.log('password: ' + $scope.user.pw);
		
		iUser.signUp($scope.user.username, $scope.user.pw, function(data) {
			console.log('added %s', data.username);
			clearUser();
		},
		function(data) {
			console.log('failed to add user');
			$scope.errMsg = data;
			clearUser(true);
			console.log(data);
		});
	};
	
	$scope.logOut = function() {
		iUser.logout(
			function() {
				console.warn('logout successful!');
				$scope.userName = '';
				$scope.loggedIn = false;
			},
			function() {
				console.warn('logout failed!');
			}
		);
	};
	
	$scope.deleteUser = function() {
		iUser.deleteLoggedIn(
			function(data) {
				console.log(data.message);
				checkSession();
				clearUser();
				clearErrMsg();
			},
			function(data) {
				console.log(data.message);
			}
		);
	};
	
}]);