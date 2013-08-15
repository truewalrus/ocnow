'use strict';

angular.module("myApp.controllers").controller('HtmlHeadCtrl', ['$scope', 'page', function ($scope, page){
    $scope.page = page;
}]);