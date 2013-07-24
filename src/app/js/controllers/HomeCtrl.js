'use strict';
angular.module("myApp.controllers").controller('HomeCtrl', ['$scope', 'user', function($scope, user){
    $scope.cont = true;

    $scope.onClick = function(){
        $scope.cont = !$scope.cont;
    };


    $scope.posts = [
        {
            img: "../img/testimg.jpg",
            title: "20 JavaScript Frameworks Worth Checking Out",
            submitter: "Siddharth",
            date: "Sep 23rd 2011",
            numberOfComments: "44",
            content: "JavaScript testing is a sensitive subject. Some developers are huge advocates of it (including myself), while others don't see the need or benefit. One huge barrier is the simple fact that it can sometimes take a considerable amount of setup to get up and running. The longer it takes, the more likely it is that the developer simply won't bother. That's why Testem is so fantastic; it makes testing as effortless as possible, and, more importantly, fun!" +
                "" +
                "JavaScript testing is a sensitive subject. Some developers are huge advocates of it (including myself), while others don't see the need or benefit. One huge barrier is the simple fact that it can sometimes take a considerable amount of setup to get up and running. The longer it takes, the more likely it is that the developer simply won't bother. That's why Testem is so fantastic; it makes testing as effortless as possible, and, more importantly, fun!"
        },
        {
            img: "../img/testimg.jpg",
            title: "20 JavaScript Frameworks Worth Checking Out",
            submitter: "Siddharth",
            date: "Sep 23rd 2011",
            numberOfComments: "44",
            content: "JavaScript testing is a sensitive subject. Some developers are huge advocates of it (including myself), while others don't see the need or benefit. One huge barrier is the simple fact that it can sometimes take a considerable amount of setup to get up and running. The longer it takes, the more likely it is that the developer simply won't bother. That's why Testem is so fantastic; it makes testing as effortless as possible, and, more importantly, fun!" +
                "" +
                "JavaScript testing is a sensitive subject. Some developers are huge advocates of it (including myself), while others don't see the need or benefit. One huge barrier is the simple fact that it can sometimes take a considerable amount of setup to get up and running. The longer it takes, the more likely it is that the developer simply won't bother. That's why Testem is so fantastic; it makes testing as effortless as possible, and, more importantly, fun!"
        }
    ];


}]);
