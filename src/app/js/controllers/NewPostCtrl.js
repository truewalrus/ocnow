'use strict';

angular.module("myApp.controllers").controller('NewPostCtrl', ['$scope', 'user', '$http', '$rootScope', 'uploadService', function($scope, user, $http, $rootScope, uploadService){

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
		menubar: false
	};

    $scope.newPost = function(){
        $scope.submitDisabled = true;
        $http.post('api/articles/create', {'_uid': $scope.username, 'article': $scope.article, 'title': $scope.title}).
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };

    $scope.findPosts = function(){
        $http.post('api/articles/getAll', {'_uid': $scope.username}).
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failur: e" + data);
            });
    };

    $scope.topPosts = function() {
        $http.get('api/articles/1/10').
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };

    $scope.nextPosts = function() {
        $http.get('api/articles/3/10').
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };

    $scope.submitDisabled = false;

    /*testing upload*/

    $scope.files = [];

    $scope.$watch('files', function (newValue, oldValue) {
        // Only act when our property has changed.
        if (newValue != oldValue) {
            console.log('Controller: $scope.files changed. Start upload.');
            for (var i = 0, length = $scope.files.length; i < length; i++) {
                // Hand file off to uploadService.
                uploadService.send($scope.files[i]);
            }
        }
    }, true);

    $rootScope.$on('upload:complete', function (event, path) {
        console.log('Completed upload to \'%s\'.', path);
    });
/*
    $rootScope.$on('upload:error', function () {
        console.log('Controller: on `error`');
    });
*/
}]);