'use strict';

angular.module("myApp.controllers").controller('NewPostCtrl', ['$scope', 'user', '$http', function($scope, user, $http){

    var checkSession = function(){
        user.checkSession(
            function(data) {
                console.log(data);
                $scope.loggedIn = true;
                $scope.username = data.username;
            },
            function(data) {
                $scope.loggedIn = false;
            }
        );
    };
    checkSession();

    $http.post('api/articles/clear', {});

	$scope.editorOptions = {
		menubar: false,
		statusbar: false
	};

    $scope.newPost = function(){
        $http.post('api/articles/create', {'_uid': $scope.username, 'article':$scope.article, 'title':$scope.title}).
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.log("failure" + data);
            });
    };

    $scope.findPosts = function(){
        $http.post('api/articles/getAll', {'_uid': $scope.username}).
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.log("failure" + data);
            });
    };

}]);