'use strict';

angular.module("myApp.controllers").controller('ProfileCtrl', ['$scope', 'user', function ($scope, user){
    var checkSession = function(){
        user.checkSession(
            function(data) {
                $scope.loggedIn = true;
                $scope.username = user.getUser().username;
            },
            function(data) {
                $scope.loggedIn = false;
            }
        );
    };
    checkSession();

}]);
