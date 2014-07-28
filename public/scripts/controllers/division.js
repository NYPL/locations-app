/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations */

nypl_locations.controller('DivisionCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    'nypl_locations_service',
    'nypl_utility',
    'breadcrumbs',
    function (
        $scope,
        $routeParams,
        $rootScope,
        $location,
        nypl_locations_service,
        nypl_utility,
        breadcrumbs
    ) {
        'use strict';
        var division,
            homeUrl,
            locationUrl,
            loadDivision = function () {
                return nypl_locations_service
                    .single_division($routeParams.division)
                    .then(function (data) {
                        division = data.division;
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
                        breadcrumbs.breadcrumbs.splice(2,0,locationUrl);
                        $scope.breadcrumbs = breadcrumbs;

                        if (division.hours) {
                            $scope.hoursToday = nypl_utility.hoursToday;
                        }

                        $scope.division = division;
                        $scope.calendar_link = nypl_utility.calendar_link;
                        $scope.ical_link = nypl_utility.ical_link;
                        $scope.siteWideAlert =
                            nypl_utility.alerts(division._embedded.alerts);

                        $scope.division.social_media =
                            nypl_utility.socialMediaColor(
                                division.social_media
                            );
                    })
                    .catch(function (error) {
                        $location.path('/404');
                    });
            };

        loadDivision();
    }
]);
