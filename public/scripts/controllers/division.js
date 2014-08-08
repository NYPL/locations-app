/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations */

function DivisionCtrl($rootScope, $scope, breadcrumbs, division, nyplUtility) {
    'use strict';

    var homeUrl,
        locationUrl;

    $scope.division = division;
    $rootScope.title = division.name;

    breadcrumbs.options = { "Division": division.name };
    homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
    locationUrl = {
        label: division.location_name,
        path: '#/' + division.location_slug
    };
    breadcrumbs.breadcrumbs.unshift(homeUrl);
    breadcrumbs.breadcrumbs.splice(2, 0, locationUrl);
    $scope.breadcrumbs = breadcrumbs;

    if (division.hours) {
        $scope.hoursToday = nyplUtility.hoursToday;
    }

    $scope.calendar_link = nyplUtility.calendar_link;
    $scope.ical_link = nyplUtility.ical_link;
    $scope.siteWideAlert = nyplUtility.alerts(division._embedded.alerts);

    $scope.division.social_media =
        nyplUtility.socialMediaColor(division.social_media);

    $scope.has_appointment = nyplUtility.divisionHasAppointment(division.id);
}

angular
    .module('nypl_locations')
    .controller('DivisionCtrl', DivisionCtrl);
