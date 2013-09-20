
'use strict';
angular.module("myApp.controllers").controller('ViewPostCtrl', ['$scope', '$routeParams', '$location', '$http', 'user', 'page', '$timeout', '$anchorScroll', '$rootScope', function($scope, $routeParams, $location, $http, user, page, $timeout, $anchorScroll, $rootScope){
    page.setPage('Article');

    $scope.post = '';
    $scope.content = '';

    var commentingDisabled = false;


    if ($routeParams.id)
    {

        if ($routeParams.id.substring(0,2) === 'yt'){
            return($location.url('/episode/' + $routeParams.id.substring(3)).replace());
        }
        $http.get('/api/articles/get/' + $routeParams.id).
            success(function(data) {
                $scope.post = data;
                if(!data){
                    $location.url('/home');
                }

                page.setPage('Article - ' + $scope.post.title);
            }).
            error(function(err) {
                console.error(err);
            });
    }
    else{
        $location.url('/home');
    }



    $scope.viewAuthorProfile = function(authorId) {
        $location.path('/user/' + authorId);
    };

    $scope.postComment = function() {
        if(commentingDisabled){
            $scope.$emit('MessagePopup' , 'Please wait 15 seconds in between posting comments', '');
        }
        else{
            $rootScope.loading = true;
            $http.post('/api/comments/add/' +$routeParams.id, {"uId":$scope.user._id, "content": $scope.content}).
                success(function(data){
                    $scope.getComments();
                    commentingDisabled = true;
                    $timeout(enableCommenting, 15000);
                    $scope.content = '';
                    $scope.post.commentCount++;
                    $rootScope.loading = false;
                }).
                error(function(err){
                    console.error(err);
                    $rootScope.loading = false;
                });
        }

    };

    var enableCommenting = function(){
        commentingDisabled = false;
    };

    $scope.comments = [];

    $scope.getComments = function(){
        $http.get('/api/comments/get/' +$routeParams.id).
            success(function(data){
                $scope.comments = data;
            }).
            error(function(err){
                console.error(err);
            });
    };
    $scope.getComments();

    $scope.reportComment = function(_id) {
        $http.post('/api/comments/flagComment', {"_id":_id, "flagged": true}).
            success(function(data){
                console.log("flagged");
                $scope.$emit("MessagePopup", '', 'Comment reported.');
            }).
            error(function(err){
                console.error(err);
                $scope.$emit("MessagePopup", err, '');
            });
    };

    $scope.deleteComment = function(_id){
        $http.post('/api/comments/removeComment', {"_id":_id, "articleId":$routeParams.id}).
            success(function(data){
                console.log("deleted");
                $scope.$emit('MessagePopup', '', "Comment Deleted.");
                $scope.getComments();
            }).
            error(function(err){
                console.error(err);
                $scope.$emit('MessagePopup', 'Failure: ' + err, "");
            });
    };

    $scope.publish = function() {
        $rootScope.loading = true;
        $http.post('/api/articles/publish', {"_id": $scope.post._id}).
            success(function(response) {
                console.log("Article published!");

                $scope.post = response.article;
                $rootScope.loading = false;
            }).
            error(function(response) {
                console.error("Article was not published.", response);
                $rootScope.loading = false;
            });
    };

    $scope.unpublish = function() {
        $rootScope.loading = true;
        $http.post('/api/articles/unpublish', {"_id": $scope.post._id, "uid": $scope.post.uid}).
            success(function(response) {
                console.log("Article unpublished!");

                $scope.post = response.article;
                $rootScope.loading = false;
            }).
            error(function(response) {
                console.error("Article was not unpublished.", response);
                $rootScope.loading = false;
            });
    };

    $scope.edit = function() {
        $location.path('/article/' + $scope.post._id + '/edit');
    };


    $scope.deleteModal = false;
    $scope.deleteDialog = function(){
        $scope.deleteModal = true;
    };
    $scope.closeDialog = function(){
        $scope.deleteModal = false;
    };

    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };


    $scope.deleteArticle = function(){
        $rootScope.loading = true;
        $http.post('/api/articles/delete/' + $routeParams.id).
            success(function(response) {
                console.log("Article deleted!");
                $scope.$emit('MessagePopup', '', 'Article deleted.');
                $location.url('/home');
                $rootScope.loading = false;
            }).
            error(function(response) {
                console.error("Article was not deleted.", response);
                $rootScope.loading = false;
            });
    };

    $scope.extractDate = function(time) {
        var d = new Date(time);

        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
    };
}]);