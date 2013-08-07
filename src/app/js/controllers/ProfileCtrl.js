'use strict';

angular.module("myApp.controllers").controller('ProfileCtrl', ['$scope', 'user', '$location', '$http', function ($scope, user, $location, $http){

    //Default Settings
    $scope.settings = 0; //tabbing between settings in Settings
    $scope.admin = 1; //show Admin settings -- default 0, testing 1
    $scope.showChangePW = 0; //Hide password change abilities
    $scope.showChangeProfilePic = 0; //Hide Profile change abilities
    //post switching
    $scope.showAdmin = 0;
    $scope.showSettings = 0;
    $scope.showPosts = 1;
    $scope.userPosts = '';

    //Create a User Settings
    $scope.newUser = {
        username: "",
        password:"",
        fName: "",
        lName: "",
        admin: false
    };

    //update a User Settings
    $scope.fName = "";
    $scope.lName = "";

    $scope.createUser = function(){
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


    //Posts
    $scope.createNewPost = function(){
        $location.url('/new-post');
    };


    //page switching
    $scope.viewSettings = function(){
        $scope.showSettings = 1;
        $scope.showAdmin = 0;
        $scope.showPosts = 0;
    };
    $scope.viewAdmin = function(){
        $scope.showSettings =0;
        $scope.showAdmin = 1;
        $scope.showPosts = 0;
    };
    $scope.viewPosts = function(){
        $scope.showSettings =0;
        $scope.showAdmin = 0;
        $scope.showPosts = 1;
    };

    //User Settings
    $scope.setPersonal = function(){
        $scope.settings = 0;
    };
    $scope.setAccount = function(){
        $scope.settings = 1;
    };
    $scope.showChangePass = function(){
        $scope.showChangePassword = !$scope.showChangePassword;
    };
    $scope.showChangePP = function(){
        $scope.showChangeProfilePic = !$scope.showChangeProfilePic;
    };
    $scope.saveUserInfo = function(){
        user.updateUser($scope.user._id, $scope.fName, $scope.lName,
            function(data){
                console.log("success" + data);
            },
            function(data){
                console.log("failure" + data);
            }
        );
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












  /*  var checkSession = function(){
        user.checkSession(
            function(data) {
                $scope.loggedIn = true;
                $scope.username = data.username;

                $http.post('api/articles/getAll', {'_uid': $scope.username}).
                    success(function(data) {
                        $scope.userPosts = data;
                        console.log($scope.userPosts);

                    }).
                    error(function(data) {
                        console.warn("Failur: e" + data);
                    });
            },
            function(data) {
                $scope.loggedIn = false;
                $location.url('/home');
            }
        );
    };
    checkSession();*/

}]);
