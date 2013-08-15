'use strict';
angular.module("myApp.services")
    .provider('page', function() {

        console.log("Inside Page Provider");

        var siteName = "Default Site Name";

        this.setSiteName = function(name) {
            siteName = name;
        };

        this.getSiteName = function() {
            return siteName;
        };

        this.$get = function() {
            var headerTitle = siteName;

            return {
                title: function() {
                    return headerTitle;
                },

                setTitle: function(title) {
                    headerTitle = title;
                },

                setPage: function(page) {
                    headerTitle = siteName + (page ? ' - ' + page : '');
                }
            };
        };

        console.log("Exiting Page Provider");
});
