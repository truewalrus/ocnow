'use strict';

angular.module("myApp.controllers")
    .controller('EpisodesCtrl', ['$scope', '$http', '$location', 'page', 'GoogleApi', function($scope, $http, $location, page, GoogleAPI){

    page.setPage("Episodes");

    $scope.page = 1;
    $scope.pageCount = 1;
    $scope.tokens = {};

    $scope.retrieveEpisodes = function(page) {
        var token;

        console.log(page);

        if (page) {
            if (page > $scope.page) {
                token = $scope.tokens.next;
            } else if (page < $scope.page) {
                token = $scope.tokens.prev;
            } else {
                return;
            }
        }

        var episodes = GoogleAPI.youtube.playlist.items('PL401099F3429AC0B2', {pageToken: token, maxResults: 5});

        episodes.then(function(videos) {
            //      console.log("Retrieved video playlist: ", videos);
            $scope.videos = videos.items;
            $scope.tokens = videos.pageTokens;

            setPager();

        }, function(error) {
            console.error(error);
        });
    };

    var setPager = function () {
        $scope.page = 1;
        $scope.pageCount = 1;

        if ($scope.tokens.prev) {
            $scope.pageCount = 2;
            $scope.page = 2;
        }

        if ($scope.tokens.next) {
            $scope.pageCount = $scope.pageCount + 1;
        }
    };

    $scope.retrieveEpisodes();
}]);