'use strict';
angular.module('myApp.filters')
    .filter('linkify', [ function() {
        return function(text) {
            var blurb = text;

            var matches = blurb.match(new RegExp('(https?://.\\S+)|(www\\.\\S+\\.\\S+)','ig'));

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
