'use strict';

angular.module("myApp.controllers").controller('PwResetCtrl', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location){

    if(!$routeParams.resetCode){
        $location.path('/sign-in').replace();
    }

    $scope.changePassword = function(){
        if($scope.newPW === $scope.confirmNew)
        {
            if($scope.newPW.length > 7){
                $http.post('/api/email/resetPassword', {'resetCode': $routeParams.resetCode, 'newPassword': $scope.newPW}).success(function(data){
                    $scope.$emit('MessagePopup', '', 'Password Reset');
                    $location.path('/sign-in').replace();
                }).error(function(data){
                        $scope.$emit('MessagePopup', data, '');
                    });
            }
            else{
                $scope.$emit('MessagePopup', "Password too short.");
            }

        }
        else{
            $scope.$emit('MessagePopup', "Passwords don't match");
        }

    };


}]);
