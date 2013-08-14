'use strict';
angular.module('myApp.services')
    .factory('uploadService', ['$rootScope', function($rootScope){
        return {
            send: function (file, type) {
                var data = new FormData(),
                xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        $rootScope.$broadcast('upload:complete', xhr.status, xhr.response);
                    }
                };

                // When the request starts.
//                xhr.onloadstart = function () {
//                    console.log('Factory: upload started: ', file.name);
//                    $rootScope.$emit('upload:loadstart', xhr);
//                };
//
//
//
//                // When the request has failed.
//                xhr.onerror = function (e) {
//                    $rootScope.$emit('upload:error', e);
//                };
                // Send to server, where we can then access it with $_FILES['file].
                data.append('file', file, file.name);
                console.log("Upload Service: Uploading %s", file.name);
                xhr.open('POST', '/api/upload/' + type + '/uploadFile');
                xhr.send(data);
            }
        };
    }]);
