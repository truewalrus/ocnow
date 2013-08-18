'use strict';

angular.module("myApp.controllers").controller('EditPostCtrl', ['$scope', '$routeParams', '$location', '$http', 'user', 'uploadService', function($scope, $routeParams, $location, $http, user, upload){

    $scope.post = { title: '', article: '' };
    $scope.editImage = false;
    $scope.image = [];

    if ($routeParams._id)
    {
        $http.get('/api/articles/get/' + $routeParams._id).
            success(function(data) {
                $scope.post = data;
            }).
            error(function(err) {
                console.error(err);
            });
    }
    else{
        $location.path('/home');
    }

    $scope.editPost = function() {
        upload.upload('/api/articles/update/' + $routeParams._id, { 'article': $scope.post.article, 'title': $scope.post.title }, $scope.image[0],
            function(response) {
                $location.path('/article/' + $routeParams._id);
            });
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
}]);