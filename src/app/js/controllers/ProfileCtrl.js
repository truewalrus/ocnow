'use strict';

angular.module("myApp.controllers").controller('ProfileCtrl', ['$scope', 'user', '$location', '$http', 'uploadService', '$rootScope', function ($scope, user, $location, $http, uploadService, $rootScope){
    var RANK_SITEADMIN = 1;
    var RANK_ADMIN = 2;
    var RANK_POSTER = 3;
    var RANK_COMMENTER = 4;

    //Default Settings
    $scope.settings = 0; //tabbing between settings in Settings
    $scope.admin = 0; //show Admin settings -- default 0, testing 1
    $scope.showChangePW = 0; //Hide password change abilities
    $scope.showChangeProfilePic = 0; //Hide Profile change abilities
    $scope.files = []; //initiate file for profile img
    $scope.imgUploadID = '';
    //post switching
    $scope.showAdmin = 0;
    $scope.showSettings = 0;
    $scope.showPosts = 1;
    $scope.userPosts = '';
    $scope.posts = '';
    $scope.adminView = 0;
    $scope.AAC = 0;
    //Grab default user settings
    var userSettings = function(){
        $scope.fName = $scope.user.fName;
        $scope.lName = $scope.user.lName;
        $scope.img = $scope.user.img;
        $scope.username = $scope.user.username;
        $scope.admin = ($scope.user.rank < RANK_POSTER); //CHECK TO SEE IF USER IS AN ADMIN
        console.log($scope.user.rank);

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

    $scope.extractDate = function(time) {
        var d = new Date(time);

        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
    };

    userSettings();
    //Create a User Settings
    $scope.newUser = {
        username: "",
        password:"",
        fName: "",
        lName: "",
        admin: false,
        rank: RANK_POSTER
    };

    //update User Settings if changes were made or if timing was missed/page refresh
    $scope.$on('userUpdated', function() {
        userSettings();
    });



    $scope.createUser = function(){
       if($scope.newUser.admin){
           $scope.newUser.rank = RANK_ADMIN;
       }
       user.signUp($scope.newUser.username, $scope.newUser.password, $scope.newUser.rank,  function(data) {
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
            password:"",
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


        //show users admin can see
        $scope.allViewableUsers = '';
        if($scope.admin >=1){
            $http.get('/api/user/allUsers').
                success(function(data){
                    $scope.allViewableUsers = data;
                }).
                error(function(data){
                    console.log(data);
                });
        }

        $scope.unpublishedPosts = '';
        if($scope.admin >=1){
            $http.get('/api/articles/getUnpublished').
                success(function(data){
                    $scope.unpublishedPosts = data;
                }).
                error(function(data){
                    console.log(data);
                });
        }

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
            $scope.saveUserInfoNoImg($scope.user._id, $scope.fName, $scope.lName, $scope.img);
        }
        else{
            $scope.imgUploadID = $scope.user._id;
            uploadService.send($scope.files[0], 'profile');
        }
    };
    $scope.saveUserInfoNoImg = function(_id, fname, lname, img){
        user.updateUser(_id, fname, lname, img,
            function(data){
              //  console.log("success" + data);
            },
            function(data){
            //    console.log("failure" + data);
            }
        );
    };

    //ADMIN ACCOUNT CONTROL (AAC)
    $scope.adminUsers = function(){
        $scope.adminView = 0;
    };
    $scope.adminPosts = function(){
        $scope.adminView = 1;
    };
    $scope.setCreate = function(){
        $scope.AAC = 0;
    };
    $scope.setList = function(){
        $scope.AAC = 1;
    };
    $scope.setViewAccount = function(){
        $scope.AAC = 2;
    };
    $scope.AACpassword = '';
    $scope.AACFName = '';
    $scope.AACLName = '';
    $scope.AACFiles = [];
    $scope.adminUserEdit = function(user){
        $scope.AACpassword = '';
        $scope.AACFName = user.fName;
        $scope.AACLName = user.lName;
        $scope.AACUsername = user.username;
        $scope.AACid = user._id;
        $scope.AACFiles = [];

        $scope.AAC = 2;
    };
    $scope.adminSaveUserInfo = function(){
        if($scope.files.length === 0){
            $scope.saveUserInfoNoImg($scope.AACid, $scope.AACFName, $scope.AACLName, '');
        }
        else{
            $scope.imgUploadID = $scope.AACid;
            uploadService.send($scope.files[0]);
        }
    };
    $scope.adminUserDelete = function(id){
        if($scope.admin >=1){
            user.deleteUser(id,
                function(data) {
                    console.log("user deleted");
                },
                function(data) {
                    console.log(data);
                });
        }
      //  $scope.viewAdmin();

    };
    $scope.publish = function(id){

        if($scope.admin >=1){
            $http.post('/api/articles/publish', {"_id": id}).
                success(function(data){
                    console.log("published");
                }).
                error(function(data){
                    console.log(data);
                });
        }

        $scope.viewAdmin();
    };



    //update user info when a new profile img is uploaded
    $scope.$on('upload:complete', function (event, code, response) {
        if (code != 200) {
            console.error("Error uploading file: %d - %s", code, response);
        }
        else {
            console.log("ProfileCtrl: File uploaded as: %s", response);

            response = '/' + response.substr(response.indexOf('\\') + 1);

            user.updateUser($scope.imgUploadID, $scope.fName, $scope.lName, response,
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

}]);
