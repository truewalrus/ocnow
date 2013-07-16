'use strict';
angular.module("myApp.controllers").controller('HomeCtrl', ['$scope', function($scope){

    $scope.cont = true;

    $scope.onClick = function(){
        $scope.cont = !$scope.cont;
    };

}]);
