'use strict';

angular.module("myApp.controllers").controller('HeaderCtrl', ['$scope', 'user', '$location','$rootScope', '$timeout', 'messageService', '$window', function ($scope, user, $location, $rootScope, $timeout, ms, $window){
    $scope.$on('userLoggedIn', function() {
        user.checkSession();
    });

    $scope.lockHeader = false;


        angular.element($window).bind('scroll', function(){
            $scope.$safeApply(function() {
                if($window.pageYOffset < 200){
                    $scope.lockHeader = false;
                }
                else{
                    $scope.lockHeader = true;
                }
            });
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