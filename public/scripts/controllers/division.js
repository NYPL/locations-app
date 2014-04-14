nypl_locations.controller('DivisionCtrl', function (
    $scope,
    $routeParams,
    nypl_locations_service,
    nypl_coordinates_service,
    nypl_utility
) {
    'use strict';
    var division,
        loadDivision = function () {
            return nypl_locations_service
                .single_division($routeParams.division)
                .then(function (data) {
                    division = data.division;
                    $scope.division = division;
                    console.log(division);
                });
        };


    loadDivision();
});
