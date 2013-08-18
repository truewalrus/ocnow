'use strict';
angular.module('myApp.filters')
    .filter('blurbFilter', [ function() {
        return function(text) {
            var blurb = text;
            blurb = blurb.replace('</p>',' ');
            blurb = blurb.replace(new RegExp('\\<.+?\\>','ig'), '');
            return blurb;
        };
    }]);
