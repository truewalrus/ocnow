'use strict';
angular.module("myApp.controllers").controller('NewVidCtrl', ['$scope', 'oauth', function($scope, oauth){
    $scope.vid = "test";

    $scope.testLogin = function (){
        var promise = oauth.login();
        promise.then(function (data) {
            console.log(data);
        }, function (reason) {
            console.log('Failed: ' + reason);
        });

    };


}]);