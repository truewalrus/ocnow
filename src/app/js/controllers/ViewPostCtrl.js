
'use strict';
angular.module("myApp.controllers").controller('ViewPostCtrl', ['$scope', '$routeParams', '$location', '$http', 'user', function($scope, $routeParams, $location, $http, user){

    $scope.post = '';
    $scope.content = '';
    if ($routeParams.id)
    {
        console.log($routeParams.id);
        $http.get('/api/articles/get/' + $routeParams.id).
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

    $scope.viewAuthorProfile = function(authorId) {
        $location.path('/user/' + authorId);
    };

    $scope.postComment = function(){
        $http.post('/api/comments/add/' +$routeParams.id, {"uId":$scope.user._id, "content": $scope.content}).
            success(function(data){
                $scope.getComments();
            }).
            error(function(err){
                console.error(err);
            });
    };

    $scope.comments = [];

    $scope.getComments = function(){
        $http.get('/api/comments/get/' +$routeParams.id).
            success(function(data){
                $scope.comments = data;
            }).
            error(function(err){
                console.error(err);
            });
    };
    $scope.getComments();

    $scope.reportComment = function(_id) {
        $http.post('/api/comments/flagComment', {"_id":_id, "flagged": true}).
            success(function(data){
                console.log("flagged");
            }).
            error(function(err){
                console.error(err);
            });
    };

    $scope.publish = function() {
        $http.post('/api/articles/publish', {"_id": $scope.post._id}).
            success(function(response) {
                console.log("Article published!");

                $scope.post = response.article;
            }).
            error(function(response) {
                console.error("Article was not published.", response);
            });
    };

    $scope.unpublish = function() {
        $http.post('/api/articles/unpublish', {"_id": $scope.post._id}).
            success(function(response) {
                console.log("Article unpublished!");

                $scope.post = response.article;
            }).
            error(function(response) {
                console.error("Article was not unpublished.", response);
            });
    };

    $scope.edit = function() {
        $location.path('/article/' + $scope.post._id + '/edit');
    };

    $scope.extractDate = function(time) {
        var d = new Date(time);

        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
    };
}]);