'use strict';
angular.module('myApp.directives')
    .directive('facebookLike', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                url: '@'
            },
            template:
                '<div class="fb-like" data-href={{url}} data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div>',


           link: function (scope, element, attributes) {
                $timeout(function () {
                    return typeof FB !== "undefined" && FB !== null ? FB.XFBML.parse(element.parent()[0]): void 0; });
            }
        };



    }]);


window.fbAsyncInit = function() {
    FB.init({
        appId: '281909378612016',
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true,  // parse XFBML
        oauth: true
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_GB/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));