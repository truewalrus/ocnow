'use strict';
angular.module('myApp.services')
    .factory('uploadService', ['$rootScope', function($rootScope){
        return {
//            send: function (file, type) {
//                var data = new FormData(),
//                xhr = new JSONHttpRequest();
//
//                xhr.onreadystatechange = function () {
//                    if (xhr.readyState == 4) {
//                        $rootScope.$broadcast('upload:complete', xhr.status, xhr.response);
//                    }
//                };
//
//                // When the request starts.
////                xhr.onloadstart = function () {
////                    console.log('Factory: upload started: ', file.name);
////                    $rootScope.$emit('upload:loadstart', xhr);
////                };
////
////
////
////                // When the request has failed.
////                xhr.onerror = function (e) {
////                    $rootScope.$emit('upload:error', e);
////                };
//                // Send to server, where we can then access it with $_FILES['file].
//                data.append('file', file, file.name);
//                console.log("Upload Service: Uploading %s", file.name);
//                xhr.open('POST', '/api/upload/' + type + '/uploadFile');
//                xhr.send(data);
//            },

            upload: function(api, form, file, success, error) {
                console.log(form, file);

                var data = new FormData();
                var xhr = new JSONHttpRequest();

                if (file) {
                    console.log("here's the error I'm looking for");
                    console.log(file === []);
                    data.append('file', file, file.name);
                    console.log('after');
                }

                for (var attr in form) {
                    data.append(attr, form[attr]);
                }

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            console.log("Success", success);
                            if (success !== undefined) {
                                if($rootScope.$$phase) {
                                    return success(xhr.responseJSON);
                                }
                                else {
                                    return $rootScope.$apply(function() {
                                        success(xhr.responseJSON);
                                    });
                                }
                            }

                            return;
                        }

                        if (error !== undefined) {
                            if($rootScope.$$phase) {
                                return error(xhr.responseJSON);
                            }
                            else {
                                return $rootScope.$apply(function() {
                                    error(xhr.responseJSON);
                                });
                            }
                        }

                        return;
                    }
                };

                xhr.open('POST', api);
                xhr.send(data);
            }
        };
    }]);
