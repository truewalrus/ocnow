'use strict';

angular.module("myApp.controllers").controller('ProfileCtrl', ['$scope', 'user', '$location', '$http', 'uploadService', '$rootScope', 'page', function ($scope, user, $location, $http, uploadService, $rootScope, page){
    page.setPage('Profile');

    if (!$scope.checkingSession && !$scope.loggedIn) { return $location.path('/sign-in').replace(); }
    $scope.$on('user:loggedOut', function(event) {
        return $location.path('/sign-in').replace();
    });

   /**************************************************************************************************
    * Initial Settings:
    *
    * Globals:     */
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

    //Default page views
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
        $scope.email = $scope.user.email;
        $scope.admin = ($scope.user.rank < RANK_POSTER); //Check to see if the user is an admin

        if($scope.user.rank === RANK_COMMENTER){
            $scope.showSettings = 1;
            $scope.showPosts = 0;
        }

        //get articles that this user has posted
        $http.get('/api/articles/getAll/'+$scope.user._id).
            success(function(data){
                $scope.posts = data;
            }).
            error(function(data){
   //             console.log(data);
            });
    };
    userSettings();
    //update User Settings if changes were made or if timing was missed/page refresh
    $scope.$on('userUpdated', function() {
        userSettings();
    });


    //page display switching
    $scope.viewSettings = function(){
        $scope.showSettings = 1;
        $scope.showAdmin = 0;
        $scope.showPosts = 0;
    };

    $scope.viewPosts = function(){
        $scope.showSettings =0;
        $scope.showAdmin = 0;
        $scope.showPosts = 1;
    };

    //Create a User initial settings and helper method to clearUser
    $scope.newUser = {
        username: "",
        password:"",
        fName: "",
        lName: "",
        admin: false,
        rank: RANK_POSTER
    };
    var clearUser = function(){
        $scope.newUser = {
            username: "",
            password:"",
            fName: "",
            lName: "",
            admin: false,
            rank: RANK_POSTER
        };
    };


    /**************************************************************************************************
    * Admin functions
    */

    //Initial settings and page setup
    $scope.viewAdmin = function(){
        $scope.showSettings =0;
        $scope.showAdmin = 1;
        $scope.showPosts = 0;


        //show users admin can see
        $scope.allViewableUsers = '';
        if($scope.admin >=1){
            adminUpdateUserList();
        }

        $scope.unpublishedPosts = '';
        if($scope.admin >=1){
            adminUpdatePosts();
        }

        $scope.flaggedComments = '';
        if($scope.admin >=1){
            adminUpdateComments();
        }

    };
    /**
    * As an admin, create a new user.
    *
    * @method createUser
    */
    $scope.createUser = function(){
       if($scope.newUser.admin){
           $scope.newUser.rank = RANK_ADMIN;
       }
       user.signUp($scope.newUser.username, $scope.newUser.password, $scope.newUser.rank, $scope.newUser.fName, $scope.newUser.lName, '', '',  function(data) {
   //             console.log('added %s', data.username);
                clearUser();
                adminUpdateUserList();
               $scope.$emit('MessagePopup', '', 'User created.');
            },
            function(data) {
                clearUser();
                $scope.$emit('MessagePopup', 'Failure: ' + data, '');
            });
    };

    /**
    * Delete a user from the list, update the list
    *
    * @method As an admin, delete a user.
    * @param id  -  user _id
    */
    $scope.adminUserDelete = function(id){
   //     console.log(id);
        if($scope.admin >=1){
            user.deleteUser(id,
                function(data) {
                    $scope.$emit('MessagePopup', '', "User Deleted.");
                    adminUpdateUserList();
                },
                function(data) {
    //                console.log(data);
                    $scope.$emit('MessagePopup', 'Failure: ' + data, "");
                });
        }

    };

    //modal for admin user delete confirmation
    $scope.deleteModal = false;
    $scope.deleteDialog = function(id){
   //     console.log(id);
        $scope.deleteModal = id;
    };
    $scope.closeDialog = function(){
        $scope.deleteModal = false;
    };

    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };

    /**
    * Publish an article from the list of unpublished articles, remove that article from the list
    *
    * @method publish
    * @param id  -  article _id
    */
    $scope.publish = function(id){

        if($scope.admin >=1){
            $http.post('/api/articles/publish', {"_id": id}).
                success(function(data){
  //                  console.log("published");
                    $scope.$emit('MessagePopup', '', "Article Published.");
                }).
                error(function(data){
   //                 console.log(data);
                    $scope.$emit('MessagePopup', 'Failure: ' + data, "");
                });
        }

        adminUpdatePosts();
    };


    //ADMIN ACCOUNT CONTROL (AAC) Initial settings
    $scope.adminUsers = function(){
        $scope.adminView = 0;
    };
    $scope.adminPosts = function(){
        $scope.adminView = 1;
    };
    $scope.adminComments = function(){
        $scope.adminView = 2;
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

    //Settings for editing a user
    $scope.AACpassword = '';
    $scope.AACFName = '';
    $scope.AACLName = '';

    //Set settings for user upon clicking edit
    $scope.adminUserEdit = function(user){
        $scope.AACpassword = '';
        $scope.AACFName = user.fName;
        $scope.AACLName = user.lName;
        $scope.AACUsername = user.username;
        $scope.AACid = user._id;
        $scope.files = [];

        $scope.AAC = 2;
    };

    /**
    * Save user settings for a non-logged in user while logged in as an admim
    *
    * @method adminSaveUserInfo
    *
    */
    $scope.adminSaveUserInfo = function(){
        if ($scope.AACid){
            user.updateUser($scope.AACid, $scope.AACFName, $scope.AACLName, $scope.files[0],
                function(){
                    $scope.files = [];
                    $scope.$emit('MessagePopup', '', 'User updated.');
                    adminUpdateUserList();},
                function(error){$scope.$emit('MessagePopup', 'Failure: ' + error, '');});

            if($scope.AACpassword){
                // console.log($scope.AACpassword);
                user.changePassword($scope.AACid, '', $scope.AACpassword,
                    function(data){
  //                      console.log(data);
                        $scope.AACpassword = '';
                    },
                    function(data){
   //                     console.log("failure");
   //                     console.log(data);
                        $scope.AACpassword = '';
                    });
            }
        }
        else{
            $scope.$emit('MessagePopup', 'No user selected.', '');
        }

    };

    /**
    * Method for unflagging flagged comments, update comment list after making a change
    *
    * @method unflagComment
    */
    $scope.unflagComment = function (_id){
        $http.post('/api/comments/flagComment', {"_id":_id, "flagged": false}).
            success(function(data){
                //   console.log("flagged");
                $scope.$emit('MessagePopup', '', "Comment Ok'd.");
            }).
            error(function(err){
                console.error(err);
                $scope.$emit('MessagePopup', 'Failure: ' + err, "");
            });


        adminUpdateComments();
    };

    /**
    * Delete flagged comments, update comment list
    *
    * @method
    */
    $scope.deleteComment = function (_id, articleId){
        $http.post('/api/comments/removeComment', {"_id":_id, "articleId":articleId}).
            success(function(data){
   //             console.log("deleted");
                $scope.$emit('MessagePopup', '', "Comment Deleted.");
            }).
            error(function(err){
                console.error(err);
                $scope.$emit('MessagePopup', 'Failure: ' + err, "");
            });


        adminUpdateComments();
    };

   /********************************************************************************************
    * Admin helper methods for list updating
    */

    /**
    * Update the userList by making a call to the user user db
    *
    * @method adminUpdateUserList
    */
    var adminUpdateUserList = function() {
        $http.get('/api/user/allUsers').
            success(function(data){
                $scope.allViewableUsers = data;
            }).
            error(function(data){
                console.log(data);
            });
    };

    /**
    * Update the list of unpublished posts by making a call to the article db
    *
    * @method adminUpdatePosts
    */
    var adminUpdatePosts = function(){
        $http.get('/api/articles/getUnpublished').
            success(function(data){
                $scope.unpublishedPosts = data;
            }).
            error(function(data){
                console.log(data);
            });
    };

    /**
    * Update the list of flagged comments by making a call to the comment db
    *
    * @method adminUpdateComments
    */
    var adminUpdateComments = function(){
        $http.get('/api/comments/getFlagged').
            success(function(data){
                $scope.flaggedComments = data;
            }).
            error(function(data){
                console.log(data);
            });
    };



    //Default methods for post control
    $scope.createNewPost = function(){
        $location.url('/new-post');
    };
 /*   $scope.viewPost = function(postId){
        $location.url('/article/' + postId);
    };*/


    /**********************************************************************************************
    * User Setup and settings
    */

    //Page Display
    $scope.setPersonal = function(){
        $scope.settings = 0;
    };
    $scope.setAccount = function(){
        $scope.settings = 1;
    };
    $scope.showChangePass = function(){
        $scope.oldPW = '';
        $scope.newPW = '';
        $scope.confirmNew = '';
    };
    $scope.showChangePP = function(){
        $scope.showChangeProfilePic = !$scope.showChangeProfilePic;
        $scope.files = [];
    };

    /**
     * Method to update user email
     *
     * @method changeEmail
     */
    $scope.changeEmail = function(){
        console.log("in?");
        console.log($scope.email);
        user.saveEmail($scope.user._id, $scope.email);
    };
    
    /**
    * Method to update a user
    *
    * @method saveUserInfo
    */
    $scope.saveUserInfo = function(){
        user.updateUser($scope.user._id, $scope.fName, $scope.lName, $scope.files[0],
            function(){
                $scope.$emit('MessagePopup', '', 'User updated.');},
            function(error){$scope.$emit('MessagePopup', 'Failure: '+error, '');});

    };


    /**
    * Password change method for a user
    *
    * @method changePassword
    * @param {}
    * @return {}
    */
    $scope.oldPW = '';
    $scope.newPW = '';
    $scope.confirmNew = '';
    $scope.changePassword = function(){
        if($scope.newPW.length < 7)
        {
            $scope.$emit('MessagePopup', 'Password must be at least 7 characters', '');
        }
        else{
            if($scope.confirmNew === $scope.newPW){
                user.changePassword($scope.user._id, $scope.oldPW, $scope.newPW,
                    function(data){
                        //                console.log(data);
                        $scope.$emit('MessagePopup', '', 'Password changed.');
                    },
                    function(data){
                        //                  console.log("failure");
                        //                   console.log(data);
                        $scope.$emit('MessagePopup', 'Failure: ' + data, '');
                    });
            }
            else {
                console.log("passwords do not match");
            }
        }


        $scope.oldPW = '';
        $scope.newPW = '';
        $scope.confirmNew = '';

    };






    /***
     * $scope.extractDate
     * @param time
     * @returns {string}
     * Takes in a nodejs time and returns a formatted date/time string
     */
    $scope.extractDate = function(time) {
        var d = new Date(time);

        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
    };

    /**
    * Extract img location from a .img
    *
    * @method profileImage
    * @param {}
    * @return {}
    */
    $scope.profileImage = function() {
        return $scope.img ? '/img/' + $scope.img : '';
    };


    /**
    * Logs the user out.
    *
    * @method logOut
    */
    $scope.logOut = function(){
        user.logout(
            function(data){
                $scope.username = '';
                $scope.loggedIn = false;
                return $location.path('/sign-in').replace();
            },
            function(data){
 //               console.log(data);
            }
        );
    };

}]);
