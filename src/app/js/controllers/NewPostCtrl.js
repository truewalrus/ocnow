'use strict';

angular.module("myApp.controllers").controller('NewPostCtrl', ['$scope', 'user', '$http', '$rootScope', '$location', 'uploadService', function($scope, user, $http, $rootScope, $location, uploadService){

    var RANK_COMMENTER = 4;

    if (!$scope.checkingSession && !$scope.loggedIn) { return $location.path('/sign-in').replace(); }
    else{
        if ($scope.user.rank === RANK_COMMENTER){
            $location.path('/home');
        }
    }
    $scope.$on('user:loggedOut', function(event) {
        return $location.path('/sign-in').replace();
    });


    var createArticle = function(imgPath) {
        if (!imgPath) { imgPath = ''; }

        $http.post('api/articles/create', {'uid': $scope.user._id, 'name': $scope.user.username, 'article': $scope.article, 'title': $scope.title ,'img': imgPath, 'published': $scope.publishArticle, 'tags': $scope.articleTags}).
            success(function(data) {
                console.log(data);
            }).
            error(function(data) {
                console.warn("Failure: " + data);
                $scope.$emit('MessagePopup', 'Failure:' + data, '');
            });


    };

    $scope.tags = [];
    $scope.articleTags = [];

    var getTags = function(){
        $http.get('/api/tags/get').
            success(function(data) {
                $scope.tags = data;
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };
    getTags();

    $scope.addTag = function(tagToAdd){
        $http.post('/api/tags/addTag', {'tag':tagToAdd}).
            success(function(data){
                getTags();
                $scope.tagToAdd = '';
            }).
            error(function(data){
                console.warn("Failure: " +data);
                $scope.$emit('MessagePopup', 'Failure: ' + data, '');
            });
    };

    $scope.deleteTag = function(tag){
        $http.post('/api/tags/deleteTag', {'_id': tag._id}).
            success(function(data){
                getTags();
            }).
            error(function(data){
                console.warn("Failure: " + data);
                $scope.$emit('MessagePopup', data, '');
            });
    };

    $scope.addTagToArticle = function(tag){
        if (!contains(tag, $scope.articleTags)){
            $scope.articleTags.push(tag);
        }
    };

    var contains = function (a, array){
        for (var i = 0; i < array.length; i++){
            if (array[i] === a){
                return true;
            }
        }
        return false;
    };

    $scope.removeTagFromArticle = function(tag){
        $scope.articleTags.splice($scope.articleTags.indexOf(tag), 1);
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

//        if($scope.files.length === 0)
//        {
//            createArticle();
//        }
//        else
//        {
//            uploadService.send($scope.files[0], 'article');
//        }

        uploadService.upload('/api/articles/create', { title: $scope.title, article: $scope.article, published: $scope.published, tags: $scope.articleTags }, $scope.files[0],
            function(response) {
                console.log("Creation success!");
                console.log('/article/%s', response.article._id);

                $location.url('/article/' + response.article._id);
                $scope.$emit('MessagePopup', '', 'Article created.');
            }, function(response) {
                $scope.submitDisabled = false;
                $scope.$emit('MessagePopup', 'Failure: ' +response, '');

            });
    };

    $scope.articleImage = function() {
        return $scope.files[0] ? $scope.files[0].path : '';
    };

    $scope.findPosts = function(){
        console.log($scope.files[0]);

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

//    $scope.$on('upload:complete', function (event, code, response) {
//        if (code != 200) {
//            console.error("Error uploading file: %d - %s", code, response);
//        }
//        else {
//            console.log("NewPostCtrl: File uploaded as: %s", response);
//
//            response = '/' + response.substr(response.indexOf('\\') + 1);
//
//            createArticle(response);
//
////            $http.post('api/articles/create', {'uid': $scope.user._id, 'name': $scope.user.username, 'article': $scope.article, 'title': $scope.title, 'img': response}).
////                success(function(data) {
////                    console.log(data);
////                }).
////                error(function(data) {
////                    console.warn("Failure: " + data);
////                });
//        }
//    });
/*
    $rootScope.$on('upload:error', function () {
        console.log('Controller: on `error`');
    });
*/
}]);