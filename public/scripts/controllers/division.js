nypl_locations.controller('DivisionCtrl', function (
    $scope,
    $routeParams,
    $rootScope,
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

                    $scope.hoursToday =
                        nypl_utility.hoursToday(division.hours);

                    $scope.division = division;

                    console.log($scope.division);
                });
        };


    loadDivision();
});
