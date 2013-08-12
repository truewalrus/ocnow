'use strict';

angular.module("myApp.controllers").controller('ProfileCtrl', ['$scope', 'user', '$location', '$http', 'uploadService', '$rootScope', function ($scope, user, $location, $http, uploadService, $rootScope){

    //Default Settings
    $scope.settings = 0; //tabbing between settings in Settings
    $scope.admin = 1; //show Admin settings -- default 0, testing 1
    $scope.showChangePW = 0; //Hide password change abilities
    $scope.showChangeProfilePic = 0; //Hide Profile change abilities
    $scope.files = []; //initiate file for profile img
    //post switching
    $scope.showAdmin = 0;
    $scope.showSettings = 0;
    $scope.showPosts = 1;
    $scope.userPosts = '';
    $scope.posts = '';
    $scope.AAC = 0;
    //Grab default user settings
    var userSettings = function(){
        $scope.fName = $scope.user.fName;
        $scope.lName = $scope.user.lName;
        $scope.img = $scope.user.img;
        $scope.username = $scope.user.username;

        //get Posts related ot this user
        $http.get('/api/articles/getAll/'+$scope.user._id).
            success(function(data){
                $scope.posts = data;
            }).
            error(function(data){
                console.log(data);
            });

    /*    if(!$scope.username){
            $location.url('/home');
        }*/
    };

    //52017afd716b34a010000001
    userSettings();
    //Create a User Settings
    $scope.newUser = {
        username: "",
        password:"",
        fName: "",
        lName: "",
        admin: false
    };

    //update User Settings if changes were made or if timing was missed/page refresh
    $scope.$on('userUpdated', function() {
        userSettings();

    });


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
    $scope.viewPost = function(postId){
        $location.url('/article/' + postId);
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
        if($scope.files.length === 0){
            $scope.saveUserInfoNoImg();
        }
        else{
            uploadService.send($scope.files[0]);
        }
    };
    $scope.saveUserInfoNoImg = function(){
        user.updateUser($scope.user._id, $scope.fName, $scope.lName, $scope.img,
            function(data){
              //  console.log("success" + data);
            },
            function(data){
            //    console.log("failure" + data);
            }
        );
    };

    //ADMIN ACCOUNT CONTROL (AAC)
    $scope.setCreate = function(){
        $scope.AAC = 0;
    };
    $scope.setList = function(){
        $scope.AAC = 1;
    };
    $scope.setViewAccount = function(){
        $scope.AAC = 2;
    };


    //update user info when a new profile img is uploaded
    $rootScope.$on('upload:complete', function (event, code, response) {
        if (code != 200) {
            console.error("Error uploading file: %d - %s", code, response);
        }
        else {
            console.log("File uploaded as: %s", response);

            response = '/' + response.substr(response.indexOf('\\') + 1);

            user.updateUser($scope.user._id, $scope.fName, $scope.lName, response,
                function(data){
                    //console.log("success" + data);
                },
                function(data){
                   // console.log("failure" + data);
                }
            );
        }
    });


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
