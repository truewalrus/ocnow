'use strict';
angular.module('myApp.filters')
    .filter('linkify', [ function() {
        return function(text, link) {
            var blurb = text;

            if (!blurb) {
                return blurb;
            }

            var regex = '(https?://.\\S+)';

            if (link) { regex = regex + '|(www\\.\\S+\\.\\S+)'; }

            var matches = blurb.match(new RegExp(regex,'ig'));

            var linkedText = '';

            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    var location = blurb.indexOf(matches[i]);

                    if (matches[i].search('https?://') == -1) {
                        linkedText = linkedText + blurb.substring(0, location) + '<a href="http://' + matches[i] + '">' + matches[i] + '</a>';
                    }
                    else {
                        linkedText = linkedText + blurb.substring(0, location) + '<a href="' + matches[i] + '">' + matches[i] + '</a>';
                    }

                    blurb = blurb.substring(location + matches[i].length);
                }
            }

            linkedText = linkedText + blurb;

            linkedText = linkedText.replace(new RegExp('\n','g'), '<br />');

            return linkedText;
        };
    }]);
