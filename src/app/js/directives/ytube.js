'use strict';
angular.module('myApp.directives')
    .directive('ytube',['$window', '$log', function($window, $log) {
        return {
            restrict: 'E',
            template: '<iframe width="420" height="315" src="http://www.youtube.com/embed/IytNBm8WA1c" frameborder="0" allowfullscreen></iframe>'
        };
    }]);

