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

nypl_locations.controller('OneServiceCtrl', function (
    $scope,
    $routeParams,
    $rootScope,
    nypl_locations_service
) {
    'use strict';
    var service_name,
        loadOneService = function () {
            return nypl_locations_service
                .one_service($routeParams.service_id)
                .then(function (data) {
                    service_name = data.service.name;
                    $rootScope.title = service_name;

                    $scope.service = data.service;
                    $scope.locations = data.locations;
                    $scope.service_name = service_name;
                });
        };

    loadOneService();

});

nypl_locations.controller('ServicesAtLibraryCtrl', function (
    $scope,
    $routeParams,
    $rootScope,
    nypl_locations_service
) {
    'use strict';
    var services,
        location,
        loadServicesAtBranch = function () {
            return nypl_locations_service
                .services_at_library($routeParams.location_id)
                .then(function (data) {
                    location = data.location;
                    services = data.services;

                    $rootScope.title = location.name;
                    $scope.location = location;
                    $scope.services = services.name;
                });
        };

    loadServicesAtBranch();
});

