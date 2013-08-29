'use strict';

angular.module("myApp.controllers")
    .controller('NewsCtrl', ['$scope', '$http', '$location', 'page', function($scope, $http, $location, page){

    page.setPage("News");

    $scope.posts = [];
    $scope.page = 1;
    $scope.pageCount = 1;

    $scope.tab = {
        current: '',

        all: 'all',
        saddleback: 'saddleback',
        local: 'local',
        national: 'national'
    };
    $scope.tab.current = $scope.tab.all;

    $scope.changeTab = function (tab) {
        $scope.tab.current = tab;

        $scope.page = 1;
        $scope.pageCount = 1;

        $scope.retrievePosts();
    };

    $scope.retrievePosts = function(page) {
        if (page) { $scope.page = page; }

        var query = 'count=8&page=' + $scope.page;

        if ($scope.tab.current != $scope.tab.all) {
            query = query + '&tag=' + $scope.tab.current;
        }

        $http.get('api/articles/front?' + query).
            success(function(data) {
                $scope.posts = data.articles;
                $scope.pageCount = data.pages;
            }).
            error(function(err) {
                console.error(err);
            });
    };

    $scope.retrievePosts();
}]);