'use strict';
angular.module("myApp.controllers").controller('HomeCtrl', ['$scope', '$http', 'user', '$location', function($scope, $http, user, $location){
    $scope.cont = true;

    $scope.posts = [];

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


}]);
