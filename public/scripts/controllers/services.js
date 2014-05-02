/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations */

nypl_locations.controller('ServicesCtrl', function (
    $scope,
    $rootScope,
    nypl_locations_service,
    breadcrumbs
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

    $scope.breadcrumbs = breadcrumbs;
    $rootScope.title = "Services";
    loadServices();
});

nypl_locations.controller('OneServiceCtrl', function (
    $scope,
    $routeParams,
    $rootScope,
    nypl_locations_service,
    breadcrumbs
) {
    'use strict';
    var service_name,
        loadOneService = function () {
            return nypl_locations_service
                .one_service($routeParams.service_id)
                .then(function (data) {
                    service_name = data.service.name;
                    $rootScope.title = service_name;
                    console.log(data);
                    $scope.service = data.service;
                    $scope.locations = data.locations;
                    $scope.service_name = service_name;

                    breadcrumbs.options = { 'Service': service_name };
                    $scope.breadcrumbs = breadcrumbs;
                });
        };

    loadOneService();

});

nypl_locations.controller('ServicesAtLibraryCtrl', function (
    $scope,
    $routeParams,
    $rootScope,
    nypl_locations_service,
    breadcrumbs
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
                    console.log(data);

                    $rootScope.title = location.name;
                    $scope.location = location;
                    $scope.services = services.name;

                    breadcrumbs.options = { 'Location': location.name };
                    $scope.breadcrumbs = breadcrumbs;
                });
        };

    loadServicesAtBranch();
});

