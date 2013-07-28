'use strict';

angular.module('myApp.directives')
    .directive('disqusComponent',['$window', '$log', function($window, $log) {

        var _initDisqus = function _initDisqus(scope)
        {
            if($window.DISQUS) {
                $window.DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.identifier = scope.threadId;
                        this.disqus_container_id = 'disqus_thread';
                    }
                });
            }
            else
            {
                $log.error('window.DISQUS did not exist before directive was loaded.');
            }
        };

        var _linkFn = function link(scope, element, attrs) {
            //element.html('<div id="disqus_thread"></div>');
            _initDisqus(scope);
        };


        return {
            replace: true,
            template: '<div id="disqus_thread"></div>',
            restrict: 'E',
            scope: {
                threadId: '@'
            },
            link: _linkFn
        };
    }]);