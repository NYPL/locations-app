/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations */

nypl_locations.controller('DivisionCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    'nypl_locations_service',
    'nypl_utility',
    function (
        $scope,
        $routeParams,
        $rootScope,
        $location,
        nypl_locations_service,
        nypl_utility
    ) {
        'use strict';
        var division,
            loadDivision = function () {
                return nypl_locations_service
                    .single_division($routeParams.division)
                    .then(function (data) {
                        division = data.division;
                        $rootScope.title = division.name;

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
                    })
                    .catch(function (error) {
                        $location.path('/404');
                    });
            };

        loadDivision();
    }
]);
