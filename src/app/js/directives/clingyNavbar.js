'use strict';

angular.module('myApp.directives')
    .directive('clingyNavbar',['$window', function($window) {

    var _compile = function(element) {
        console.log(element);
        element.innerHTML = '<div></div>' + element.innerHTML;

        return _link;
    };

    var _link = function(scope, element) {
        console.log(element);
        var isFixed = false;

        var updateScroll = function() {

            if (!isFixed && $window.pageYOffset > element[0].offsetTop) {
                angular.element(element[1]).addClass('navbar-fixed-top');
                element[0].css('height',element[1].offsetHeight + 'px');
                isFixed = true;
            }
            else if (isFixed && $window.pageYOffset <= element[0].offsetTop) {
                angular.element(element[1]).removeClass('navbar-fixed-top');
                element[0].css('height',element[1].offsetHeight + 'px');
                isFixed = false;
            }
        };

        angular.element($window).bind('scroll', function() {
            updateScroll();
        });

        updateScroll();
    };

    return {
        restrict: 'A',
        compile: _compile
    };
}]);