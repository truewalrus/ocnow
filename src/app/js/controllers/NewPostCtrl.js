'use strict';

angular.module("myApp.controllers").controller('NewPostCtrl', ['$scope', 'user', '$http', '$rootScope', 'uploadService', function($scope, user, $http, $rootScope, uploadService){

    var createArticle = function(imgPath) {
        if (!imgPath) { imgPath = ''; }

        $http.post('api/articles/create', {'uid': $scope.user._id, 'name': $scope.user.username, 'article': $scope.article, 'title': $scope.title ,'img': imgPath, 'published': $scope.publishArticle}).
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };

  /*  var checkSession = function(){
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
*/
    $scope.clearDatabase = function() {
        $http.post('api/articles/clear', {});
    };

	$scope.editorOptions = {
		menubar: false
	};

    $scope.newPost = function(){
        $scope.submitDisabled = true;

        if($scope.files.length === 0)
        {
            createArticle();
        }
        else
        {
            for (var i = 0, length = $scope.files.length; i < length; i++) {
                // Hand file off to uploadService.
                uploadService.send($scope.files[i]);
            }
        }


    };

    $scope.findPosts = function(){
        $http.post('api/articles/getAll', {'_uid': $scope.username}).
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };

    $scope.topPosts = function() {
        $http.get('api/articles/1/3').
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };

    $scope.nextPosts = function() {
        $http.get('api/articles/2/3').
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };

    $scope.publishArticle = false;
    $scope.isAdmin = ($scope.user.rank <= 2);

    console.log($scope.user.rank);

    $scope.submitDisabled = false;

    /*testing upload*/

    $scope.files = [];

//    $scope.$watch('files', function (newValue, oldValue) {
//        // Only act when our property has changed.
//        if (newValue != oldValue) {
//            console.log('Controller: $scope.files changed. Start upload.');
//            for (var i = 0, length = $scope.files.length; i < length; i++) {
//                // Hand file off to uploadService.
//                uploadService.send($scope.files[i]);
//            }
//        }
//    }, true);

    $rootScope.$on('upload:complete', function (event, code, response) {
        if (code != 200) {
            console.error("Error uploading file: %d - %s", code, response);
        }
        else {
            console.log("File uploaded as: %s", response);

            response = '/' + response.substr(response.indexOf('\\') + 1);

            createArticle(response);

//            $http.post('api/articles/create', {'uid': $scope.user._id, 'name': $scope.user.username, 'article': $scope.article, 'title': $scope.title, 'img': response}).
//                success(function(data) {
//                    console.log(data);
//                }).
//                error(function(data) {
//                    console.warn("Failure: " + data);
//                });
        }
    });
/*
    $rootScope.$on('upload:error', function () {
        console.log('Controller: on `error`');
    });
*/
}]);