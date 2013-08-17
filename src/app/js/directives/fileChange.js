'use strict';
angular.module('myApp.directives')
    .directive('fileChange', function($window, $log) {
        var linker = function ($scope, element, attributes) {
            // onChange, push the files to $scope.files.
            element.bind('change', function (event) {
                $scope.files = [];
                var files = event.target.files;
                $scope.$apply(function () {
                    for (var i = 0, length = files.length; i < length; i++) {
                        $scope.files.push(files[i]);
                    }
                });
            });
        };

        return {
            restrict: 'A',
            link: linker
        };

    });