
'use strict';
angular.module("myApp.controllers").controller('ViewVideoCtrl', ['$scope', '$routeParams', '$location', '$http', 'user', 'page', 'GoogleApi', '$timeout', function($scope, $routeParams, $location, $http, user, page, GoogleAPI, $timeout){
    page.setPage('Episode');

    var commentingDisabled = false;
    $scope.commentCount = 0;

    $scope.video = {
        snippet: {
            resourceId: {
                videoId: ''
            }
        }
    };

    $scope.videoEmbedSrc = function() {
        return $scope.video.snippet.resourceId.videoId ? 'http://www.youtube.com/embed/' + $scope.video.snippet.resourceId.videoId : '';
    };

    if ($routeParams.id) {
        var episode = GoogleAPI.youtube.playlist.items('PLB974F6E8F4766DB9', {maxResults: 1, videoId: $routeParams.id});

        episode.then(function(videos) {
            $scope.video = videos[0];

            page.setPage('Episode &mdash; ' + $scope.video.snippet.title);

    /*        $http.get('/api/comments/count?id=yt-' + $routeParams.id).
                success(function(response) {
                    $scope.video.commentCount = response.count;
                }).error(function(response) {
                    $scope.video.commentCount = 0;
                });*/
        }, function(error) {
            console.error(error);
        });
    }

//    if ($routeParams.id)
//    {
//        console.log($routeParams.id);
//        $http.get('/api/articles/get/' + $routeParams.id).
//            success(function(data) {
//                $scope.post = data;
//
//                page.setPage('Article - ' + $scope.post.title);
//            }).
//            error(function(err) {
//                console.error(err);
//            });
//    }
//    else{
//        $location.url('/home');
//    }



//    $scope.viewAuthorProfile = function(authorId) {
//        $location.path('/user/' + authorId);
//    };
//
    $scope.postComment = function() {
        if(commentingDisabled){
            $scope.$emit('MessagePopup' , 'Please wait 15 seconds in between posting comments', '');
        }
        else{
            $http.post('/api/comments/add/yt-' + $routeParams.id, {"uId":$scope.user._id, "content": $scope.content}).
                success(function(data){
                    $scope.getComments();
                    commentingDisabled = true;
                    $timeout(enableCommenting, 15000);
                    $scope.content = '';
                }).
                error(function(err){
                    console.error(err);
                });
        }

    };

    var enableCommenting = function(){
        commentingDisabled = false;
    };

    $scope.comments = [];

    $scope.getComments = function(){
        $http.get('/api/comments/get/yt-' + $routeParams.id).
            success(function(data){
                $scope.comments = data;
                $scope.commentCount = data.length;
              //  console.log(data);
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
        $http.post('/api/comments/removeComment', {"_id":_id}).
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
//
//    $scope.publish = function() {
//        $http.post('/api/articles/publish', {"_id": $scope.post._id}).
//            success(function(response) {
//                console.log("Article published!");
//
//                $scope.post = response.article;
//            }).
//            error(function(response) {
//                console.error("Article was not published.", response);
//            });
//    };
//
//    $scope.unpublish = function() {
//        $http.post('/api/articles/unpublish', {"_id": $scope.post._id}).
//            success(function(response) {
//                console.log("Article unpublished!");
//
//                $scope.post = response.article;
//            }).
//            error(function(response) {
//                console.error("Article was not unpublished.", response);
//            });
//    };
//
//    $scope.edit = function() {
//        $location.path('/article/' + $scope.post._id + '/edit');
//    };
//
//    $scope.extractDate = function(time) {
//        var d = new Date(time);
//
//        return d.toLocaleTimeString() + " on " + d.toLocaleDateString();
//    };
}]);