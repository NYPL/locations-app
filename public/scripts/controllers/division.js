/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, angular */

(function () {
    'use strict';

    function DivisionCtrl($rootScope, $scope, division, nyplUtility) {
        var homeUrl,
            locationUrl;

        $scope.division = division;
        $rootScope.title = division.name;

        // breadcrumbs.options = { "Division": division.name };
        // homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
        // locationUrl = {
        //     label: division.location_name,
        //     path: '#/' + division.location_slug
        // };
        // breadcrumbs.breadcrumbs.unshift(homeUrl);
        // breadcrumbs.breadcrumbs.splice(2, 0, locationUrl);
        // $scope.breadcrumbs = breadcrumbs;

        if (division.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(division.hours);
        }

        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;
        $scope.siteWideAlert = nyplUtility.alerts(division._embedded.alerts);

        $scope.division.social_media =
            nyplUtility.socialMediaColor(division.social_media);

        $scope.has_appointment =
            nyplUtility.divisionHasAppointment(division.id);
    }

    angular
        .module('nypl_locations')
        .controller('DivisionCtrl', DivisionCtrl);
})();
