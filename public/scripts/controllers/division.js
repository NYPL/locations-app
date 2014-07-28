/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations */

function DivisionCtrl($scope, $rootScope, nypl_utility, breadcrumbs, division) {
    'use strict';

    var homeUrl,
        locationUrl;

    $scope.division = division;
    $rootScope.title = division.name;

    breadcrumbs.options = {
        "Division": division.name
    };
    homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
    locationUrl = {
        label: division.location_name,
        path: '#/' + division.location_slug
    };
    breadcrumbs.breadcrumbs.unshift(homeUrl);
    breadcrumbs.breadcrumbs.splice(2, 0, locationUrl);
    $scope.breadcrumbs = breadcrumbs;

    if (division.hours) {
        $scope.hoursToday = nypl_utility.hoursToday;
    }

    $scope.calendar_link = nypl_utility.calendar_link;
    $scope.ical_link = nypl_utility.ical_link;
    $scope.siteWideAlert = nypl_utility.alerts(division._embedded.alerts);

    $scope.division.social_media =
        nypl_utility.socialMediaColor(division.social_media);
}

nypl_locations.controller('DivisionCtrl', DivisionCtrl);
