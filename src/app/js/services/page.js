'use strict';

// Page is a service provider used to set the browser title bar to a specific title.
angular.module("myApp.services")
    .provider('page', function() {

        // App-configurable site name. It is used as the base text for the title (e.g., "[siteName] - Home").
        // Configure within the main application config block.
        var siteName = "Default Site Name";

        // Setter for siteName.
        this.setSiteName = function(name) {
            siteName = name;
        };

        // Getter for siteName.
        this.getSiteName = function() {
            return siteName;
        };

        // Injectable service to set the title
        this.$get = function() {
            // Variable storing the current browser title. Initially "[siteName]".
            var headerTitle = siteName;

            return {
                // Getter for the current browser title, to be used as <title ng-bind="[injectedPageService].title()">Default Title</title>
                title: function() {
                    return headerTitle;
                },

                // Service-available getter for siteName.
                getSiteName: function(siteName) {
                    return siteName;
                },

                // Sets the page title in the format "[siteName] - [page]". If null or empty, will set the title to "[siteName]".
                setPage: function(page) {
                    headerTitle = siteName + (page ? ' - ' + page : '');
                },

                // Sets the entire title for the browser. Used only when complete control of the title is required. The title is set to "[title]".
                setTitle: function(title) {
                    headerTitle = title;
                }
            };
        };
});
