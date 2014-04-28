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
                    var library_name;
                    services = data.services;
                    library_name = data.location.name;

                    $rootScope.title = library_name;
                    $scope.services = services.name;
                    $scope.library_name = library_name;
                });
        },
        loadBranchesbyService = function() {
            return nypl_locations_service
                .service_branches($routeParams.symbol)
                .then(function (data) {
                    var service_name;

                    console.log(data);
                    $scope.locations = data.locations;
                    $scope.service_name = data.service.name;

                    $rootScope.title = service_name;
                });
        }

    if (isNaN(service_route)) {
        loadServicesByBranch();
    } else {
        loadBranchesbyService();
    }
});
