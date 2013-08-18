'use strict';
angular.module("myApp.controllers").controller('HomeCtrl', ['$scope', '$http', 'user', '$location', 'page', 'GoogleApi', function($scope, $http, user, $location, page, GoogleAPI){
    page.setPage();

    $scope.cont = true;

    $scope.posts = [];

    $scope.video = {
        id: '',
        snippet: {
            title: '',
            description: '',
            publishedAt: '',
            resourceId: {
                videoId: ''
            },
            thumbnails: {
                medium: {
                    url: ''
                }
            }
        },
        commentCount: 0
    };

    var episodes = GoogleAPI.youtube.playlist.items('PLB974F6E8F4766DB9', {maxResults: 1});

    episodes.then(function(videos) {
        console.log("Retrieved video playlist: ", videos);
        $scope.video = videos[0];

        $http.get('/api/comments/count?id=yt-' + $scope.video.snippet.resourceId.videoId).
            success(function(response) {
                $scope.video.commentCount = response.count;
            }).error(function(response) {
                $scope.video.commentCount = 0;
            });
    }, function(error) {
        console.error(error);
    });

    $scope.onClick = function(){
        $scope.cont = !$scope.cont;
    };

    $scope.retrievePosts = function() {
        $http.get('api/articles/front?page=1&count=10').
            success(function(data) {
                $scope.posts = data;
            }).
            error(function(err) {
                console.error(err);
            });
    };

    $scope.retrievePosts();
/*
    $scope.viewPost = function(postId){
        $location.url('/article/' + postId);
    };

    $scope.viewAuthorProfile = function(authorId) {
        $location.path('/user/' + authorId);
    };*/
}]);
