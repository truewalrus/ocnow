'use strict';
angular.module('myApp.services')
    .factory('uploadService', ['$rootScope', function($rootScope){
        return {
            send: function (file) {
                var data = new FormData(),
                    xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {

                    console.log("Ready State Changed: " + xhr.readyState);
                    if (xhr.readyState == 4) {
                        $rootScope.$emit('upload:complete', xhr.response);
                    }
                };

                // When the request starts.
            /*    xhr.onloadstart = function () {
                    console.log('Factory: upload started: ', file.name);
                    $rootScope.$emit('upload:loadstart', xhr);
                };



                // When the request has failed.
                xhr.onerror = function (e) {
                    $rootScope.$emit('upload:error', e);
                };
*/
                // Send to server, where we can then access it with $_FILES['file].
                console.log(file);
                data.append('file', file, file.name);
                console.log(file.name);
                xhr.open('POST', 'api/upload/uploadFile');
                xhr.send(data);
            }
        };
    }]);
