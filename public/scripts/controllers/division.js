/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, angular */

(function () {
    'use strict';

    function DivisionCtrl($rootScope, $scope, config, division, nyplUtility) {
        var divisionsWithApt = config.divisions_with_appointments;

        $scope.division = division;
        $scope.location = division._embedded.location;

        $rootScope.title = division.name;
        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        if (division.hours.exceptions) {
            division.hours.exceptions.description =
                nyplUtility.returnHTML(division.hours.exceptions.description);
        }

        if (division.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(division.hours);
        }

        // Calculate hours today for sub-divisions
        if (division._embedded.divisions) {
            _.each(division._embedded.divisions, function (division) {
                division.hoursToday = nyplUtility.hoursToday(division.hours);
            });
        }

        if (!division.fundraising) {
            if (division._embedded.parent) {
                division.fundraising = division._embedded.parent.fundraising ||
                    division._embedded.location.fundraising;
            } else {
                division.fundraising = division._embedded.location.fundraising;
            }
        }

        $scope.division.social_media =
            nyplUtility.socialMediaColor(division.social_media);

        $scope.has_appointment =
            nyplUtility.divisionHasAppointment(divisionsWithApt, division.id);
    }

    angular
        .module('nypl_locations')
        .controller('DivisionCtrl', DivisionCtrl);
})();
