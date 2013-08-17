'use strict';
angular.module('myApp.filters')
    .filter('commentFilter', [ function() {
        return function(text) {
            var words = ['fuck', 'shit', 'faggot'];
            var reg = words.join ('(a|e|ed|er|ing?)?s?|') + '(a|e|ed|er|ing?)?s?';
            reg = reg.replace(/[a]/gim, '(a|4|@|\\*)');
            reg = reg.replace (/[s]/gim, '([sz5$]+)');

            return String(text).replace(new RegExp(reg, 'gi'), "****");
        };
    }]);
