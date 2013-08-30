'use strict';
angular.module("myApp.controllers").controller('HomeCtrl', ['$scope', '$http', 'user', '$location', 'page', 'GoogleApi', function($scope, $http, user, $location, page, GoogleAPI){
    page.setPage();

    $scope.url = "";

    $scope.page = 1;
    $scope.showPrevious = false;
    $scope.showNext = true;

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

    $scope.viewVideoHref = function() {
        return $scope.video.id ? '/episode/' + $scope.video.snippet.resourceId.videoId : '';
    };

    $scope.videoEmbedSrc = function() {
        return $scope.video.snippet.resourceId.videoId ? 'http://www.youtube.com/embed/' + $scope.video.snippet.resourceId.videoId : '';
    };

    var episodes = GoogleAPI.youtube.playlist.items('PL401099F3429AC0B2', {maxResults: 1});

    episodes.then(function(videos) {
  //      console.log("Retrieved video playlist: ", videos);
        $scope.video = videos.items[0];

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
        $http.get('api/articles/front?page='+$scope.page+'&count=3').
            success(function(data) {
                $scope.posts = data.articles;
                if ($scope.posts.length < 10){
                    $scope.showNext = false;
                }
            }).
            error(function(err) {
                console.error(err);
            });
    };

    $scope.retrievePosts();

    $scope.nextPage = function(){
        $scope.page++;
        $scope.showPrevious = true;
        $scope.retrievePosts();
    };

    $scope.previousPage = function(){
        $scope.page--;
        if ($scope.page === 1){
            $scope.showPrevious = false;
        }
        $scope.showNext = true;
        $scope.retrievePosts();
    };

/*
    $scope.viewPost = function(postId){
        $location.url('/article/' + postId);
    };

    $scope.viewAuthorProfile = function(authorId) {
        $location.path('/user/' + authorId);
    };*/
    $scope.slides = [];
    $scope.slides.push({text: 'cats!', image: 'http://placekitten.com/300/200'});
    $scope.slides.push({text: 'cats!', image: 'http://placekitten.com/301/200'});
    $scope.slides.push({text: 'cats!', image: 'http://placekitten.com/302/200'});
}]);
