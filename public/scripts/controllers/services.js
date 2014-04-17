nypl_locations.controller('ServicesCtrl', function (
    $scope,
    $routeParams,
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
    var services,
        library_name,
        loadServices = function () {
            return nypl_locations_service
                .library_services($routeParams.symbol)
                .then(function (data) {
                    services = data.services;
                    library_name = data.location.name;

                    $rootScope.title = library_name;
                    $scope.services = services.name;
                    $scope.library_name = library_name;
                });
        };

    loadServices();
});
