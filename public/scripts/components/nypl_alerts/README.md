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
        <nypl-global-alerts></nypl-global-alerts>

    * ### NYPL location specific alerts
        <nypl-location-alerts alerts="location._embedded.alerts"></nypl-location-alerts> 
        *location._embedded.alerts represents an object that contains a list of alerts*