'use strict';

angular.module("myApp.controllers").controller('SearchCtrl', ['$scope', '$http', '$routeParams', '$location', '$rootScope', function ($scope, $http, $routeParams, $location, $rootScope){
    $scope.posts = '';
    if($routeParams.query){
        $http.get('/api/articles/search/' + $routeParams.query).
            success(function(data){
                $scope.posts = data;
                $rootScope.loading = false;
            }).
            error(function(data){
                console.log(data);
                $rootScope.loading = false;
            });
    }


    $scope.viewPost = function(postId){
        $location.url('/article/' + postId);

    };
}]);