'use strict';

angular.module("myApp.controllers")
    .controller('ViewProfileCtrl', ['$scope', 'user', '$location', '$http', '$routeParams', 'page', function ($scope, user, $location, $http, $params, page) {

    //******************************************************************************************************************
    // Initial Page Setup

    // Initializes the scope variables for the controller
    $scope.userInfo = {};
    $scope.posts = [];
    $scope.comments = [];

    // Sets the default view profile title.
    page.setPage('View Profile');

    // If the user logged in is currently the same as the user being viewed, redirects to the user's personal profile page. -- this is currently taken out so users can view their own profile
   // if ((!$scope.checkingSession && $scope.loggedIn && $scope.user._id == $params.id) || ($params.id === '')) { return $location.path('/profile').replace(); }

    // If the application entry point is this page, listens for the session retrieval callback and then redirects as above.
    $scope.$on('userLoggedIn', function(event) {
        if ($scope.user._id == $params.id) { return $location.path('/profile').replace(); }
    });

    //******************************************************************************************************************
    // View-handling Logic

    // Initializes the view options and sets the current view to Posts.
    var view = { posts: 'posts', comments: 'comments' };
    $scope.currentView = view.posts;

    // Changes the current view to Posts.
    $scope.viewPosts = function( ) {
        $scope.currentView = view.posts;
    };

    // Changes the current view to Comments.
    $scope.viewComments = function( ) {
        $scope.currentView = view.comments;
    };

    //******************************************************************************************************************
    // AJAX Methods

    // Requests all user information, post history, and comment history from the server.
    var retrieveUser = function( ) {

        // Requests information from the server for the user specified in the url parameters.
        $http.get('/api/user/id/' + $params.id).
            success(function(response) {
                $scope.userInfo = response.user;
                if ($scope.userInfo.rank > 3){
                    $scope.currentView = view.comments;
                }

                // Replaces the current page's default title with a user-specific one.
                page.setPage(user.parseName(response.user) + '\'s Profile');

                // Requests the post history from the server for the user specified in the url parameters.
                $http.get('/api/articles/getAll/' + $params.id).
                    success(function(posts){
                        $scope.posts = posts;
                    }).
                    error(function(error){
                        console.error("(ViewProfileCtrl.js) Error occurred while retrieving the user's post history:", error);
                    });

                // Requests the comment history from the server for the user specified in the url paramaters.
                $http.get('/api/comments/getUserComments/' + $params.id).
                    success(function(comments){
                        $scope.comments = comments;
                    }).
                    error(function(error){
                        console.error("(ViewProfileCtrl.js) Error occurred while retrieving the user's comment history:", error);
                    });
            }).
            error(function(error) {
                console.error("(ViewProfileCtrl.js) Error occurred while retrieving the user's information:", error);
            });
    };

    //******************************************************************************************************************
    // AJAX Initialization Calls

    // Completely fills out the profile page.
    retrieveUser();

    //******************************************************************************************************************
    // Action Methods

    // Helper method displays the date in a human-readable format.
    $scope.extractDate = function(time) {
        var d = new Date(time);

        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
    };

    // Click method navigates to a specific article's page.
    $scope.viewPost = function(postId){
        $location.path('/article/' + postId);
    };
}]);
