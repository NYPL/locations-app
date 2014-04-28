/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations */

nypl_locations.controller('ServicesCtrl', function (
    $scope,
    $rootScope,
    nypl_locations_service
) {
    'use strict';
    var services,
        loadServices = function () {
            return nypl_locations_service
                .services()
                .then(function (data) {
                    services = data.services;

                    $scope.services = services;
                });
        };

    $rootScope.title = "Services";
    loadServices();
});

nypl_locations.controller('ServiceLibraryCtrl', function (
    $scope,
    $routeParams,
    $rootScope,
    nypl_locations_service
) {
    'use strict';
    var service_route = +$routeParams.symbol;

    if (isNaN(service_route)) {
        console.log('NAN');
    }

    var services,
        locations,
        loadServicesByBranch = function () {
            return nypl_locations_service
                .library_services($routeParams.symbol)
                .then(function (data) {
                    var location = data.location;
                    services = data.services;

                    $rootScope.title = location.name;

                    $scope.services = services.name;
                    $scope.library_href = location._id;
                    $scope.library_name = location.name;
                });
        },
        loadBranchesbyService = function() {
            return nypl_locations_service
                .service_branches($routeParams.symbol)
                .then(function (data) {
                    var service_name = data.service.name;

                    $scope.service = data.service;
                    $scope.locations = data.locations;
                    $scope.service_name = service_name;

                    $rootScope.title = service_name;
                });
        }

    if (isNaN(service_route)) {
        loadServicesByBranch();
    } else {
        loadBranchesbyService();
    }
});
