'use strict';

angular.module("myApp.controllers").controller('SignInCtrl', ['$scope','user', '$location', function($scope, user, $location){
    var RANK_COMMENTER = 4;

    if (!$scope.checkingSession && $scope.loggedIn) { return $location.path('/profile').replace(); }

    $scope.$on('userLoggedIn', function() {
        return $location.path('/profile').replace();
    });


    $scope.username = '';
    $scope.password = '';

     $scope.newUser = {
        username: "",
        password:"",
        confirm:"",
        fName: "",
        lName: "",
        rank: RANK_COMMENTER
    };
    var clearUser = function(){
        $scope.newUser = {
            username: "",
            password:"",
            confirm:"",
            fName: "",
            lName: "",
            rank: RANK_COMMENTER
        };
    };

    $scope.createUser = function(){
        if ($scope.newUser.password === $scope.newUser.confirm){
            user.signUp($scope.newUser.username, $scope.newUser.password, $scope.newUser.rank, $scope.newUser.fName, $scope.newUser.lName,  function(data) {
                    console.log('added %s', data.username);
                    $scope.login($scope.newUser.username, $scope.newUser.password);

                },
                function(data) {
                    clearUser();
                    $scope.$emit('MessagePopup', data, '');
                });
        }
        else{
            $scope.$emit('MessagePopup', "Passwords don't match.", '');
        }

    };

    $scope.login = function(username, password){
        user.login(username, password,
            function(data){
                var emitun = $scope.newUser.username || $scope.username;
                $scope.$emit('MessagePopup', '', 'Welcome ' + emitun + '.');
                clearUser();
                $scope.username = '';
                $scope.password = '';
            },
            function(data){
                $scope.$emit('MessagePopup', 'Error: ' + data, '');
                $scope.username = '';
                $scope.password = '';
            });
    };


/*	$scope.signingIn = true;
	$scope.userName = '';
//	$scope.user = {};
//	$scope.loggedIn = false;

    if (!$scope.checkingSession && $scope.loggedIn) { return $location.path('/profile').replace(); }

    $scope.$on('userLoggedIn', function() {
        return $location.path('/profile').replace();
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
	
//	var checkSession = function() {
//		iUser.checkSession(
//			function(data) {
//			//	$scope.loggedIn = true;
//			//	$scope.userName = data.username;
//			},
//			function(data) {
//			//	$scope.loggedIn = false;
//			}
//		);
//	};
//	checkSession();
	
	$scope.showSignIn = function() {
		clearErrMsg();
		$scope.signingIn = true;
		
		//console.log('sign in true');
		
		clearUser();
	};
	
	$scope.showSignUp = function() {
		clearErrMsg();
		$scope.signingIn = false;
		
		//console.log('sign in false');
		
		clearUser();
	};
	
	$scope.signIn = function() {
		clearErrMsg();
	//	console.log('%cSigning In', "color: red;font-weight:bold;");
	//	console.log('- Username: ' + $scope.user.username);
	//	console.log('- Password: ' + $scope.user.pw);
		
		iUser.login($scope.user.username, $scope.user.pw, function(data) {
			console.log('logged in!');
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
		
		iUser.signUp($scope.user.username, $scope.user.pw, 4, '', '', function(data) {
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
	
//	$scope.logOut = function() {
//		iUser.logout(
//			function() {
//				console.warn('logout successful!');
//				$scope.userName = '';
//			//	$scope.loggedIn = false;
//			},
//			function() {
//				console.warn('logout failed!');
//			}
//		);
//	};
	
//	$scope.deleteUser = function() {
//		iUser.deleteUser(iUser._id,
//			function(data) {
//				console.log(data.message);
//				checkSession();
//				clearUser();
//				clearErrMsg();
//			},
//			function(data) {
//				console.log(data.message);
//			}
//		);
//	};*/
	
}]);