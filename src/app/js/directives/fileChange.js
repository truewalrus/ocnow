'use strict';
angular.module('myApp.directives')
    .directive('fileChange', function($window, $log) {
        var linker = function ($scope, element, attributes) {
            // onChange, push the files to $scope.files.
            element.bind('change', function (event) {
                //$scope.files = [];
                var acceptedFileTypes = ["jpg", "png", "gif"];
                var files = event.target.files;
                console.log(files[0]);
                var ext = files[0].name.substring(files[0].name.lastIndexOf('.') + 1).toLowerCase();
                console.log(ext);
                $scope.$apply(function () {
                    var accepted = false;
                    for (var i = 0 ; i < acceptedFileTypes.length; i++){
                        if (acceptedFileTypes[i] === ext){
                            accepted = true;
                        }
                    }
                    if (accepted){
                        if ($scope.files.length >= 1){
                            $scope.files.pop();
                        }
                        $scope.files.push(files[0]);
                    }
                    else{
                        $scope.$emit('MessagePopup', 'Error: Filetype not allowed. Please select an allowed filetype: ' + acceptedFileTypes, '');
                    }

                /*    for (var i = 0, length = files.length; i < length; i++) {
                        $scope.files.push(files[i]);
                    }*/
                });
            });
        };

        return {
            restrict: 'A',
            link: linker
        };

    });