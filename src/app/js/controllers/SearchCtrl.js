'use strict';

angular.module("myApp.controllers").controller('SearchCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams){
    $http.get('/api/articles/search/' + $routeParams.query).
        success(function(data){
            console.log(data);
        }).
        error(function(data){
            console.log(data);
        });
}]);