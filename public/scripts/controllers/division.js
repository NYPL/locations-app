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

        nyplUtility.scrollToHash();
        $scope.createHash = function (id) {
            nyplUtility.createHash(id);
        };

        if (division.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(division.hours);

            if (division.hours.exceptions) {
                division.hours.exceptions.description =
                    nyplUtility
                        .returnHTML(division.hours.exceptions.description);
            }
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
            nyplUtility.divisionHasAppointment(divisionsWithApt, division.id);
    }
    DivisionCtrl.$inject = ["$rootScope", "$scope", "config", "division", "nyplUtility"];

    angular
        .module('nypl_locations')
        .controller('DivisionCtrl', DivisionCtrl);
})();
