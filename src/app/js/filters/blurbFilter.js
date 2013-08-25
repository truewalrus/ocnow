'use strict';
angular.module('myApp.filters')
    .filter('blurbFilter', [ function() {
        var characterLimit = 350;

        return function(text, limit) {
            var blurb = text;

            if (blurb) {

                if (!limit || limit < 3) {
                    limit = characterLimit;
                }

                blurb = blurb.replace('</p>',' ');
                blurb = blurb.replace(new RegExp('\\<.+?\\>','ig'), '');
                blurb = blurb.replace('&nbsp;', ' ');
                blurb = blurb.replace('&lt;', '<');
                blurb = blurb.replace('&gt;', '>');

                if (blurb.length < limit) {
                    blurb = blurb.substr(0, limit);
                }
                else {
                    blurb = blurb.substr(0, limit - 3);
                    blurb = blurb + '...';
                }

            }

            return blurb;
        };
    }]);
