/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, angular */

(function () {
    'use strict';

    function DivisionCtrl($rootScope, $scope, division, nyplUtility) {
        var homeUrl,
            locationUrl;

        $scope.division  = division;
        $rootScope.title = division.name;
        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;
        $scope.siteWideAlert = nyplUtility.alerts(division._embedded.alerts);

        if (division.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(division.hours);
        }

        // Calculate hours today for sub-divisions
        if (division._embedded.divisions) {
            _.each(division._embedded.divisions, function (division) {
                division.hoursToday = nyplUtility.hoursToday(division.hours);
            });
        }

        $scope.division.social_media =
            nyplUtility.socialMediaColor(division.social_media);

        $scope.has_appointment =
            nyplUtility.divisionHasAppointment(division.id);
    }

    angular
        .module('nypl_locations')
        .controller('DivisionCtrl', DivisionCtrl);
})();
