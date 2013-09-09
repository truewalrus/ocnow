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

/*    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
//var disqus_shortname = 'trurek'; // required: replace example with your forum shortname

/* * * DON'T EDIT BELOW THIS LINE * * */
/*(function() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();*/