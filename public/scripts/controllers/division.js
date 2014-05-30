/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */

nypl_locations.controller('DivisionCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    'nypl_locations_service',
    'nypl_utility',
    'breadcrumbs',
    function (
        $scope,
        $routeParams,
        $rootScope,
        nypl_locations_service,
        nypl_utility,
        breadcrumbs
    ) {
        'use strict';
        var division,
            loadDivision = function () {
                return nypl_locations_service
                    .single_division($routeParams.division)
                    .then(function (data) {
                        division = data.division;
                        $rootScope.title = division.name;

                        breadcrumbs.options = {
                            "Home": division.location_name,
                            "Division": division.name
                        };
                        // This seems a bit hacky but it's because we need to override
                        // the home link to go to the location where the division
                        // is located.
                        breadcrumbs.breadcrumbs[0].path = "/" + division.location_slug;
                        $scope.breadcrumbs = breadcrumbs;

                        if (division.hours) {
                            $scope.hoursToday = nypl_utility.hoursToday;
                        }

                        $scope.division = division;

                        $scope.siteWideAlert =
                            nypl_utility.alerts(division._embedded.alerts);

                        $scope.division.social_media =
                            nypl_utility.socialMediaColor(
                                division.social_media
                            );
                    });
            };


        loadDivision();
    }
]);
