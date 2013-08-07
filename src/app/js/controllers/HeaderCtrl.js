'use strict';

angular.module("myApp.controllers").controller('HeaderCtrl', ['$scope', 'user', '$location', function ($scope, user, $location){
    $scope.$on('userLoggedIn', function() {
        user.checkSession();
    });



    /*$scope.$on('userLoggedOut', function(){
        $scope.loggedIn = false;
        $scope.username = '';
    });*/

   // console.log(user.isLoggedIn());
    user.checkSession();

    $scope.viewProfile = function(){
        console.log($location.url());
        $location.url('/profile');
    };
}]);