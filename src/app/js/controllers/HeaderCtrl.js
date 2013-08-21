'use strict';

angular.module("myApp.controllers").controller('HeaderCtrl', ['$scope', 'user', '$location','$rootScope', '$timeout', 'messageService', '$window', function ($scope, user, $location, $rootScope, $timeout, ms, $window){
    $scope.$on('userLoggedIn', function() {
        user.checkSession();
    });

    $scope.pageUrl = "http://www.google.com";

    /*$scope.$on('userLoggedOut', function(){
        $scope.loggedIn = false;
        $scope.username = '';
    });*/

   // console.log(user.isLoggedIn());
    user.checkSession();
    $scope.query='';

    $scope.viewProfile = function(){
        console.log($location.url());
        $location.url('/profile');
    };

    $scope.search = function(){
        if ($scope.query){
            $location.path('/search').search({'query': $scope.query});
        }

    };


}]);