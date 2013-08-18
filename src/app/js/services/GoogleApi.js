'use strict';

var gapiInterface = {
    loaded: false,
    callback: function() { },
    load: function() {
        console.info("Google API Client Script: Google Client API has been loaded.");
        this.loaded = true;
        this.callback();
    }
};

angular.module('myApp.services').provider('GoogleApi', function () {
    var appApiKey = '';
    var initializing = false;
    var loaded = false;

    this.setApiKey = function(apiKey) {
        console.log("Google API Provider: API Key set to " + apiKey);
          appApiKey = apiKey;
    };

    this.$get = ['$rootScope', '$q', function($rootScope, $q) {
        var requestCode = {
            youtube: {
                playlistItems: {
                    list: 'youtube.playlistItems.list'
                }
            }
        };

        var requestQueue = [];

        var initialize = function(broadcastScope) {
            initializing = true;
            gapi.client.setApiKey(appApiKey);

            console.log("Google API Service: Initialized Google API. Loading API components...");
            gapi.client.load('youtube', 'v3', function() {
                loaded = true;

                console.info("Google API Service: API components loaded.");

                if (requestQueue.length > 0) {
                    executeRequestQueue();
                }
            });
        };

        var parseRequestCode = function (code) {
            if (code == requestCode.youtube.playlistItems.list) {
                return gapi.client.youtube.playlistItems.list;
            }
            else {
                console.error("Google API Service: Unknown parse request code.");
            }
        };

        if (!initializing) {
            console.log("Google API Service: Google API Service not initialized. Initializing...");

            if (!gapiInterface.loaded) {
                console.warn("Google API Service: Google API not yet loaded. Postponing initialization...");
                gapiInterface.callback = initialize;
            }
            else {
                console.info("Google API Service: Google API is loaded.");
                initialize();
            }
        }
        else {
            console.log("Google API Service is connected.");
        }

        var queueRequest = function(request, params, callback) {
            requestQueue.push({request: request, params: params, callback: callback});
        };

        var executeRequestQueue = function() {
            console.log("Google API Service: Found %s pending requests, executing...", requestQueue.length);

            for (var i = 0; i < requestQueue.length; i++) {
                var request = parseRequestCode(requestQueue[i].request)(requestQueue[i].params);

                request.execute(requestQueue[i].callback);
            }

            requestQueue = [];
        };

        return {
            youtube: {
                playlist: {
                    items: function(playlistId, params) {
                        var results = $q.defer();

                        if (!params) { params = {}; }

                        params.part = 'id,snippet';
                        params.playlistId = playlistId;

                        var callback = function(response) {
                            $rootScope.$safeApply( function() {
                                if (response.error) {
                                    results.reject(response.error);
                                }
                                else {
                                    results.resolve(response.items);
                                }
                            });
                        };

                        if (loaded) {
                            console.log("Google API Service: Received request. Executing...");
                            var request = gapi.client.youtube.playlistItems.list(params);

                            request.execute(callback);
                        }
                        else {
                            console.warn("Google API Service: Received request but API is not loaded. Postponing request...");
                            queueRequest(requestCode.youtube.playlistItems.list, params, callback);
                        }

                        return results.promise;
                    }
                }
            }
        };
    }];
});

angular.module('myApp.services').run(['GoogleApi', function(GoogleApi) {

}]);

(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client.js?onload=gapiLoad';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

function gapiLoad() {
    gapiInterface.load();
}