'use strict';

angular.module("myApp.controllers").controller('HeaderCtrl', ['$scope', 'user', '$location', function ($scope, user, $location){
    $scope.$on('userLoggedIn', function() {
        $scope.loggedIn = true;
        $scope.username = user.getUser().username;
    });

    $scope.$on('userLoggedOut', function(){
        $scope.loggedIn = false;
        $scope.username = '';
    });

    var checkSession = function(){
        user.checkSession(
            function(data) {
                console.log(data);
                $scope.loggedIn = true;
                $scope.username = data.username;
            },
            function(data) {
                $scope.loggedIn = false;
            }
        );
    };
    checkSession();

    $scope.viewProfile = function(){
        console.log($location.url());
        $location.url('/profile');
    };
}]);