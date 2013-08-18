'use strict';
angular.module("myApp.controllers").controller('HomeCtrl', ['$scope', '$http', 'user', '$location', 'page', 'GoogleApi', function($scope, $http, user, $location, page, GoogleAPI){
    page.setPage();

    $scope.cont = true;

    $scope.posts = [];

    $scope.videos = [];

    var episodes = GoogleAPI.youtube.playlist.items('PL66Y-U6XiSG2AdBTWfRjvhw8ItsMpOCJR', {maxResults: 1});

    episodes.then(function(videos) {
        console.log("Retrieved video playlist: ", videos);
        $scope.videos = videos;
    }, function(error) {
        console.error(error);
    });

    $scope.onClick = function(){
        $scope.cont = !$scope.cont;
    };

    $scope.retrievePosts = function() {
        $http.get('api/articles/front/1/10').
            success(function(data) {
              //  console.log(data);

                $scope.posts = data;
            }).
            error(function(err) {
                console.error(err);
            });
    };

    $scope.extractDate = function(time) {
        var d = new Date(time);

        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
    };

    $scope.retrievePosts();

    $scope.viewPost = function(postId){
        $location.url('/article/' + postId);
    };

    $scope.viewAuthorProfile = function(authorId) {
        $location.path('/user/' + authorId);
    };
}]);
