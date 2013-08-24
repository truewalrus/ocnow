'use strict';
angular.module('myApp.filters')
    .filter('blurbFilter', [ function() {
        var characterLimit = 350;

        return function(text) {
            var blurb = text;
            blurb = blurb.replace('</p>',' ');
            blurb = blurb.replace(new RegExp('\\<.+?\\>','ig'), '');
            blurb = blurb.replace('&nbsp;', ' ');
            blurb = blurb.replace('&lt;', '<');
            blurb = blurb.replace('&gt;', '>');

            if (blurb.length < characterLimit) {
                blurb = blurb.substr(0, characterLimit);
            }
            else {
                blurb = blurb.substr(0, characterLimit - 3);
                blurb = blurb + '...';
            }

            return blurb;
        };
    }]);
