'use strict';
angular.module('myApp.services')
    /*   .service('oauth', ['$http', function($http){

        var OnLoadCallback = function() {

            console.log("test");
        };
    }]);
/*
      this.getMyVideos = function(){
            $http.jsonp('https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyAR61gl3uKPz59viYfdfvWvbM_44dG8UG0&part=snippet,contentDetails,statistics,status&callback=JSON_CALLBACK').then(function (response) {
                console.log(response.data);
            });
        };
*/




    .service('oauth', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
        var clientId = '174155098942.apps.googleusercontent.com',
            apiKey = 'AIzaSyAR61gl3uKPz59viYfdfvWvbM_44dG8UG0',
            scopes = ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
            domain = 'localhost',
            userEmail,
            deferred = $q.defer();
        var channelId;

        this.login = function () {
          //  console.log(gapi);
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, this.handleAuthResult);
            return deferred.promise;
        };

        this.uploadVid = function() {

        };


        this.handleAuthResult = function(authResult) {
            console.log(authResult);
            if (authResult && !authResult.error) {
                var data = {};
                gapi.client.load('youtube', 'v3', function () {
                    gapi.client.load('youtubeAnalytics', 'v1', function(){
                        console.log(gapi.client.youtube);
                        var request = gapi.client.youtube.channels.list({
                            mine: true,
                            part: 'id, contentDetails'
                        });

                        request.execute(function(response){
                            if ('error' in response) {
                                console.log(response.error.message);
                            }
                            else
                            {
                               // console.log(response);
                                channelId = response.items[0].id;
                                var favListId = response.items[0].contentDetails.relatedPlaylists.favorites;

                                var request = gapi.client.youtube.playlistItems.list({
                                    playlistId: favListId,
                                    part: 'snippet'
                                });

                                request.execute (function(response){
                                    if ('error' in response){
                                        console.log(response.error.message);
                                    }
                                    else{
                                        if ('items' in response){
                                            data = response;
                                            console.log(data);
                                        }
                                        else
                                        {
                                            console.log("no vids found");
                                        }
                                    }
                                });
                                deferred.resolve(data);

                               // console.log('uploadListId ' + uploadsListId);
                            }


                        });
                    });
                });
            }
            else{
                deferred.reject('error');
            }
               /*     var request = gapi.client.oauth2.userinfo.get();
                    request.execute(function (resp) {
                        $rootScope.$apply(function () {
                            data.email = resp.email;
                        });
                    });
                });*/
          /*      deferred.resolve(data);
            } else {
                deferred.reject('error');
            }*/
        };



/*

        this.handleAuthClick = function (event) {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false, hd: domain }, this.handleAuthResult );
            return false;
        };

        this.checkAuth = function() {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true, hd: domain }, this.handleAuthResult );
        };

        this.handleClientLoad = function () {
            gapi.client.setApiKey(apiKey);
            gapi.auth.init(function () { });
            window.setTimeout(this.checkAuth, 1);
        };
*/

    }]);



//(function() {
//    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
//    po.src = 'https://apis.google.com/js/client:plusone.js';
//    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
//})();

