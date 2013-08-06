'use strict';

angular.module("myApp.controllers").controller('ProfileCtrl', ['$scope', 'user', '$location', function ($scope, user, $location){

    //Default Settings
    $scope.settings = 0;
    $scope.admin = 1;
    $scope.showSettings = 0;

    //Create a User Settings
    $scope.newUser = {
        username: "",
        password:"",
        fName: "",
        lName: "",
        admin: false
    };

    $scope.createUser = function(){
        console.log('username: ' + $scope.newUser.username);
        console.log('password: ' + $scope.newUser.password);

        user.signUp($scope.newUser.username, $scope.newUser.password, function(data) {
                console.log('added %s', data.username);
                clearUser();
            },
            function(data) {
                console.log('failed to add user');
                $scope.errMsg = data;
                clearUser();
                console.log(data);
            });
    };
    var clearUser = function(){
        $scope.newUser = {
            username: "",
            password:'"',
            fName: "",
            lName: "",
            admin: false
        };
    };


    //page switching
    $scope.viewSettings = function(){
        $scope.showSettings = 1;
        $scope.showAdmin = 0;
    };
    $scope.viewAdmin = function(){
        $scope.showSettings =0;
        $scope.showAdmin = 1;
    };

    //User Settings
    $scope.setPersonal = function(){
        $scope.settings = 0;
    };

    $scope.setAccount = function(){
        $scope.settings = 1;
    };


    $scope.logOut = function(){
        user.logout(
            function(data){
                $location.url('/home');
                $scope.username = '';
                $scope.loggedIn = false;
            },
            function(data){
                console.log(data);
            }
        );
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
