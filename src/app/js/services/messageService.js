'use strict';
angular.module('myApp.services')
    .service('messageService', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope){

        $rootScope.$on('MessagePopup', function(evt, msg_error, msg_notify) {
            $rootScope.msg_error = msg_error;
            $rootScope.msg_notify = msg_notify;
            console.log('did i get in?');
            console.log(msg_error);
            console.log(msg_notify);
            $timeout(onMsgTimeout, 3000);
        });

        $rootScope.$on('TESTEMIT', function(evt){
            console.log("DID IT WORK?");
        });

        var onMsgTimeout = function(){
            $rootScope.msg_error = '';
            $rootScope.msg_notify= '';
        };

    }]);