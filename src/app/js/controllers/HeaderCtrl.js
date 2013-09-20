'use strict';

angular.module("myApp.controllers").controller('HeaderCtrl', ['$scope', 'user', '$location', 'messageService', '$rootScope', function ($scope, user, $location, ms, $rootScope){
    $scope.$on('userLoggedIn', function() {
        user.checkSession();
        console.log($scope.user);
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
        $location.url('/profile');
    };

    $scope.search = function(){
        $rootScope.loading = true;
        if ($scope.query){
            $location.path('/search').search({'query': $scope.query});
        }

    };

    $scope.redirectHome = function(){
        $location.path('/home');
    };


}]);