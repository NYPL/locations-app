nypl_locations.controller('CollectionsCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    'nypl_locations_service',
    'nypl_utility',
    function (
        $scope,
        $routeParams,
        $rootScope,
        nypl_locations_service,
        nypl_utility
    ) {
        'use strict';

        var divisions,
            loadDivisions = function () {
                return nypl_locations_service
                    .all_divisions($routeParams.division)
                    .then(function (data) {
                        divisions = data.divisions;

                        _.each(divisions, function (division) {
                            var rarebooks = ['SCM', 'BRG', 'CPS'];
                            if (_.contains(rarebooks, division.id)) {
                                division.medium = 0;
                                console.log(division);
                            }

                            var manuscripts = ['MSS', 'SCM', 'SPN'];
                            if (_.contains(manuscripts, division.id)) {
                                division.medium = 2;
                            }
                        });

                        $scope.divisions = divisions;
                        console.log(divisions);
                    })
                    .catch(function (error) {
                        $location.path('/404');
                    });
            };

        $rootScope.title = "Research Collections";
        $scope.hoursToday = nypl_utility.hoursToday;
        $scope.searchBy = {};
        $scope.data = [
            {
                id: 0,
                name: 'Subject',
                sub: [
                    { 'sub': 'African American History' },
                    { 'sub': 'African Studies' },
                    { 'sub': 'Anthropology' },
                    { 'sub': 'Archaeology' },
                    { 'sub': 'Architecture' },
                    { 'sub': 'Art History' },
                    { 'sub': 'Artists\' Books' },
                    { 'sub': 'Business & Finance' },
                    { 'sub': 'Children\'s Literature' },
                    { 'sub': 'Classics' },
                    { 'sub': 'Culinary Studies' },
                    { 'sub': 'Dance' },
                    { 'sub': 'Decorative Arts' },
                    { 'sub': 'East Asian Studies' },
                    { 'sub': 'Eastern European Studies' },
                    { 'sub': 'Economics ' },
                    { 'sub': 'Film, Television, & Radio' },
                    { 'sub': 'Gay & Lesbian Studies' },
                    { 'sub': 'Genealogy' },
                    { 'sub': 'Industry' },
                    { 'sub': 'Jewish Studies' },
                    { 'sub': 'Latin American Studies' },
                    { 'sub': 'Literature' },
                    { 'sub': 'Maps' },
                    { 'sub': 'Middle Eastern Studies' },
                    { 'sub': 'Music' },
                    { 'sub': 'Native American Studies' },
                    { 'sub': 'New York City History' },
                    { 'sub': 'Philosophy' },
                    { 'sub': 'Photography' },
                    { 'sub': 'Political Science' },
                    { 'sub': 'Popular Culture' },
                    { 'sub': 'Prints' },
                    { 'sub': 'Psychology' },
                    { 'sub': 'Religion' },
                    { 'sub': 'Slavic & Baltic Studies' },
                    { 'sub': 'Sociology' },
                    { 'sub': 'South Asian Studies' },
                    { 'sub': 'Sports' },
                    { 'sub': 'Theatre' },
                    { 'sub': 'U.S. History' },
                    { 'sub': 'Western European Studies' },
                    { 'sub': 'Women\'s Studies' },
                    { 'sub': 'World History' }
                ]
            },
            {
                id: 1,
                name: 'Medium',
                sub: [
                    { 'sub': 'Rare Books', 'id': 0 },
                    { 'sub': 'Government Documents', 'id': 1 },
                    { 'sub': 'Manuscripts', 'id': 2 },
                    { 'sub': 'Archives', 'id': 3 },
                    { 'sub': 'Maps', 'id': 4 },
                    { 'sub': 'Scores', 'id': 5 },
                    { 'sub': 'Film and Video', 'id': 6 },
                    { 'sub': 'Sound Recordings', 'id': 7 },
                    { 'sub': 'Photographs', 'id': 8 },
                    { 'sub': 'Prints', 'id': 9 },
                    { 'sub': 'Newspapers', 'id': 10 },
                    { 'sub': 'Artists\' Books', 'id': 11 },
                    { 'sub': 'Art & Artifacts', 'id': 12 }
                ]
            },
            {
                id: 2,
                name: "Collection"
            },
            {
                id: 3,
                name: "Location"
            }

        ];


        loadDivisions();
        
    }
]);
