'use strict';

angular.module("myApp.controllers").controller('ProfileCtrl', ['$scope', 'user', function ($scope, user){

    $scope.settings = 0;

    $scope.setPersonal = function(){
        $scope.settings = 0;
    };

    $scope.setAccount = function(){
        $scope.settings = 1;
    };












    var checkSession = function(){
        user.checkSession(
            function(data) {
                $scope.loggedIn = true;
                $scope.username = data.username;
            },
            function(data) {
                $scope.loggedIn = false;
            }
        );
    };
    checkSession();

}]);
