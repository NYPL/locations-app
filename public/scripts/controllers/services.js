/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations */

// Load all the services available.
nypl_locations.controller('ServicesCtrl', [
    '$scope',
    '$rootScope',
    'nypl_locations_service',
    function (
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
                        services = data.services;console.log(data);
                        $scope.services = services;
                    });
            };

        $rootScope.title = "Services";
        loadServices();
    }
]);

// Load one service and list all the locations
// where the service can be found.
nypl_locations.controller('OneServiceCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    'nypl_locations_service',
    function (
        $scope,
        $routeParams,
        $rootScope,
        nypl_locations_service
    ) {
        'use strict';
        var service,
            locations,
            loadOneService = function () {
                return nypl_locations_service
                    .one_service($routeParams.service_id)
                    .then(function (data) {
                        service = data.service;
                        locations = data.locations;

                        $rootScope.title = service.name;
                        $scope.service = service;
                        $scope.locations = locations;
                        $scope.service_name = service.name;
                    });
            };

        loadOneService();
    }
]);

// Load one location and list all the services
// found in that location.
nypl_locations.controller('ServicesAtLibraryCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    'nypl_locations_service',
    function (
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
                        services = location._embedded.services;

                        $rootScope.title = location.name;
                        $scope.location = location;
                        $scope.services = services;
                    });
            };

        loadServicesAtBranch();
    }
]);

