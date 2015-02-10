NYPL Alerts AngularJS Module
===========

## Intro:

This module provides the ability to retrive NYPL global/location alerts for use in your application.
By utilizing the built-in Provider and Service functions, you can easily retrieve relevant NYPL Alerts in your Angular JS app. Custom directives have also been included to display alerts.

## Installation:

1. In your application dependencies, inject the NYPL Alerts module:

    ```javascript
    angular.module('myApp', ['nyplAlerts'])
    ```

2. Add the `<script>` file to your `index.html`:

    ```html
    <script src="/scripts/components/nypl_alerts/nypl_alerts.js"></script>
    ```

3. Initialize the NYPL Alerts API settings in your config function (required):

    ```javascript
    .config(['$nyplAlertsProvider', function ($nyplAlertsProvider) {
        // nyplAlerts required config settings
        $nyplAlertsProvider.setOptions({
            api_root: 'http://dev.locations.api.nypl.org/api',
            api_version: 'v0.7'
        });    
    });
    ```
4. Once all the above has been completed you can use any of the included directives:

    * ### NYPL global alerts directive
    ```html
    <nypl-global-alerts></nypl-global-alerts>
    ```

    * ### NYPL location specific alerts
    ```html
    <nypl-location-alerts alerts="location._embedded.alerts"></nypl-location-alerts>
    ```
        **location._embedded.alerts** represents an object that contains a list of alerts. This is a required field within the directive in order to render all location specific alerts.

5. Import NYPL Alerts styling to your application (optional):

    ### GRUNT
    * Using **grunt-contrib-concat**
    ```javascript
    concat: {
      /* Your basic application with added compontent styles
      basic_and_components: {
        src: ['public/css/*.scss',
              'public/scripts/components/**/*.scss'],
        dest: 'public/css/locations-concat.scss',
      }
    ```
    * Then using **grunt-contrib-sass**, compile all concatenated files into a proper minified sass file

    ### SASS
      ```
      @import "application_path/scripts/compontents/nypl_alerts/nypl_alerts.scss"
      ```