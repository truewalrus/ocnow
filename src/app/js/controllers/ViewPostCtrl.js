
'use strict';
angular.module("myApp.controllers").controller('ViewPostCtrl', ['$scope', '$routeParams', '$location', '$http', 'user', function($scope, $routeParams, $location, $http, user){

    $scope.post = '';
    $scope.content = '';
    if ($routeParams.id)
    {
        console.log($routeParams.id);
        $http.get('/api/articles/get/'+$routeParams.id).
            success(function(data) {
                $scope.post = data;
            }).
            error(function(err) {
                console.error(err);
            });
    }
    else{
        $location.url('/home');
    }

    $scope.postComment = function(){
        $http.post('/api/comments/' +$routeParams.id, {"uId":$scope.user._id, "content": $scope.content}).
            success(function(data){
                $scope.getComments();
            }).
            error(function(err){
                console.error(err);
            });
    };

    $scope.comments = [];

    $scope.getComments = function(){
        $http.get('/api/comments/' +$routeParams.id).
            success(function(data){
                $scope.comments = data;
            }).
            error(function(err){
                console.error(err);
            });
    };
    $scope.getComments();

    $scope.extractDate = function(time) {
        var d = new Date(time);

        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
    };




}]);