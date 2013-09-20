'use strict';

angular.module("myApp.controllers").controller('EditPostCtrl', ['$scope', '$routeParams', '$location', '$http', 'user', 'uploadService', '$rootScope', function($scope, $routeParams, $location, $http, user, upload, $rootScope){

    $scope.post = { title: '', article: '', img: '', tags: [] };
    //$scope.editImage = false;
    $scope.files = [];

    if ($routeParams._id)
    {
        $http.get('/api/articles/get/' + $routeParams._id).
            success(function(data) {
                $scope.post = data;
                if($scope.post.tags){
                   $scope.post.tags = $scope.post.tags.split(',');
                }
                else{
                    $scope.post.tags = [];
                }
            }).
            error(function(err) {
                console.error(err);
            });
    }
    else{
        $location.path('/home');
    }

    $scope.editPost = function() {
        $rootScope.loading = true;
        upload.upload('/api/articles/update/' + $routeParams._id, { 'article': $scope.post.article, 'title': $scope.post.title, 'tags':$scope.post.tags }, $scope.files[0],
            function(response) {
                $location.path('/article/' + $routeParams._id);
                $scope.$emit('MessagePopup', '', 'Article updated.');

                $http.post('/api/articles/unpublish', {"_id": $scope.post._id, "uid": $scope.post.uid}).
                    success(function(response) {
                        console.log("Article unpublished!");
                        $rootScope.loading = false;

                       // $scope.post = response.article;
                    }).
                    error(function(response) {
                        console.error("Article was not unpublished.", response);
                        $rootScope.loading = false;
                    });
            });
    };

    $scope.tags = [];


    var getTags = function(){
        $http.get('/api/tags/get').
            success(function(data) {
                $scope.tags = data;
            }).
            error(function(data) {
                console.warn("Failure: " + data);
            });
    };
    getTags();

    $scope.addTag = function(tagToAdd){
        $rootScope.loading = true;
        if (tagToAdd){
            $http.post('/api/tags/addTag', {'tag':tagToAdd}).
                success(function(data){
                    getTags();
                    $scope.tagToAdd = '';
                    $rootScope.loading = false;
                }).
                error(function(data){
                    console.warn("Failure: " +data);
                    $scope.$emit('MessagePopup', 'Failure: ' + data, '');
                    $rootScope.loading = false;
                });
        }

    };

    $scope.deleteTag = function(tag){
        $http.post('/api/tags/deleteTag', {'_id': tag._id}).
            success(function(data){
                getTags();
            }).
            error(function(data){
                console.warn("Failure: " + data);
                $scope.$emit('MessagePopup', data, '');
            });
    };

    $scope.addTagToArticle = function(tag){
      //  if (!contains(tag, $scope.post.tags)){
            $scope.post.tags.push(tag);
    /*    }
        else{
            $scope.$emit('MessagePopup', '', 'Already added.');
        }*/
    };

    $scope.removeTagFromArticle = function(tag){
        $scope.post.tags.splice($scope.post.tags.indexOf(tag), 1);
    };

    var contains = function (a, array){
        for (var i = 0; i < array.length; i++){
            if (array[i] === a){
                return true;
            }
        }
        return false;
    };


    $scope.editorOptions = {
		menubar: false
	};

    $scope.newPost = function(){
        $scope.submitDisabled = true;
    };

    $scope.publishArticle = false;
    $scope.isAdmin = ($scope.user.rank <= 2);

    $scope.submitDisabled = false;

    $scope.filterDuplicates = function(item){
        if (!contains(item.tag, $scope.post.tags)){
            return item;
        }
        return '';

    };
}]);