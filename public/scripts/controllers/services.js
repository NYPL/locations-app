nypl_locations.controller('ServicesCtrl', function (
    $scope,
    $routeParams
) {
    'use strict';
    var services,
        loadServices = function () {
            return nypl_locations_service
                .services()
                .then(function (data) {
                    services = data.services;
                    $scope.services = services.name;
                    console.log(services);
                });
        };


    loadServices();
});

nypl_locations.controller('ServiceLibraryCtrl', function (
    $scope,
    $routeParams,
    nypl_locations_service
) {
    'use strict';
    var services,
        loadServices = function () {
            return nypl_locations_service
                .library_services($routeParams.symbol)
                .then(function (data) {
                    services = data.services;
                    $scope.services = services;
                    console.log(services);
                });
        };


    loadServices();
});
