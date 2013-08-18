'use strict';

angular.module("myApp.controllers").controller('SearchCtrl', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location){
    $scope.posts = '';
    $http.get('/api/articles/search/' + $routeParams.query).
        success(function(data){
            $scope.posts = data;
        }).
        error(function(data){
            console.log(data);
        });

    $scope.viewPost = function(postId){
        $location.url('/article/' + postId);

    };
}]);