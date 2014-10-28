/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $location, $ */

(function () {
    'use strict';

    function CollectionsCtrl(
        $scope,
        $rootScope,
        config,
        divisions,
        nyplLocationsService,
        nyplUtility
    ) {
        'use strict';

        _.each(divisions, function (division) {
            division.medium = [];
            var medium = {
                rarebooks: {id: 0, divs: ['RBK', 'SCM', 'BRG', 'CPS']},
                manuscripts: {id: 2, divs: ['MSS', 'SCM', 'SPN', 'BRG', 'CPS', 'THE', 'TOFT', 'DAN', 'MUS']},
                archives: {id: 3, divs: ['MSS', 'SCM', 'SPN', 'BRG', 'THE', 'TOFT', 'DAN', 'MUS']},
                map: {id: 4, divs: ['MAP']},
                scores: {id: 5, divs: ['MUS']},
                filmvideo: {id: 6, divs: ['TOFT', 'MSS', 'SCL', 'DAN']},
                soundrecordings: {id: 7, divs: ['RHA', 'SCL']},
                photographs: {id: 8, divs: ['PHG', 'SCL', 'PRN', 'THE', 'TOFT', 'MSS']},
                prints: {id: 9, divs: ['PRN', 'SCL']},
                newspapers: {id: 10, divs: ['GRD']},
                artistsbook: {id: 11, divs: ['SPN']},
                artartifacts: {id: 12, divs: ['SCF']}
            };

            _.each(medium, function (m) {
                if (_.contains(m.divs, division.id)) {
                    division.medium.push(m.id);
                }
            });
        });

        $scope.divisions = divisions;
        console.log($scope.divisions);

        $rootScope.title = "Research Collections";
        $scope.hoursToday = nyplUtility.hoursToday;
        $scope.searchBy = {};
        $scope.data = [
            {
                id: 0,
                name: 'Subject',
                list: [
                    { 'item': 'African American History' },
                    { 'item': 'African Studies' },
                    { 'item': 'Anthropology' },
                    { 'item': 'Archaeology' },
                    { 'item': 'Architecture' },
                    { 'item': 'Art History' },
                    { 'item': 'Artists\' Books' },
                    { 'item': 'Business & Finance' },
                    { 'item': 'Children\'s Literature' },
                    { 'item': 'Classics' },
                    { 'item': 'Culinary Studies' },
                    { 'item': 'Dance' },
                    { 'item': 'Decorative Arts' },
                    { 'item': 'East Asian Studies' },
                    { 'item': 'Eastern European Studies' },
                    { 'item': 'Economics ' },
                    { 'item': 'Film, Television, & Radio' },
                    { 'item': 'Gay & Lesbian Studies' },
                    { 'item': 'Genealogy' },
                    { 'item': 'Industry' },
                    { 'item': 'Jewish Studies' },
                    { 'item': 'Latin American Studies' },
                    { 'item': 'Literature' },
                    { 'item': 'Maps' },
                    { 'item': 'Middle Eastern Studies' },
                    { 'item': 'Music' },
                    { 'item': 'Native American Studies' },
                    { 'item': 'New York City History' },
                    { 'item': 'Philosophy' },
                    { 'item': 'Photography' },
                    { 'item': 'Political Science' },
                    { 'item': 'Popular Culture' },
                    { 'item': 'Prints' },
                    { 'item': 'Psychology' },
                    { 'item': 'Religion' },
                    { 'item': 'Slavic & Baltic Studies' },
                    { 'item': 'Sociology' },
                    { 'item': 'South Asian Studies' },
                    { 'item': 'Sports' },
                    { 'item': 'Theatre' },
                    { 'item': 'U.S. History' },
                    { 'item': 'Western European Studies' },
                    { 'item': 'Women\'s Studies' },
                    { 'item': 'World History' }
                ]
            },
            {
                id: 1,
                name: 'Medium',
                list: [
                    { 'item': 'Rare Books', 'id': 0 },
                    { 'item': 'Government Documents', 'id': 1 },
                    { 'item': 'Manuscripts', 'id': 2 },
                    { 'item': 'Archives', 'id': 3 },
                    { 'item': 'Maps', 'id': 4 },
                    { 'item': 'Scores', 'id': 5 },
                    { 'item': 'Film and Video', 'id': 6 },
                    { 'item': 'Sound Recordings', 'id': 7 },
                    { 'item': 'Photographs', 'id': 8 },
                    { 'item': 'Prints', 'id': 9 },
                    { 'item': 'Newspapers', 'id': 10 },
                    { 'item': 'Artists\' Books', 'id': 11 },
                    { 'item': 'Art & Artifacts', 'id': 12 }
                ]
            },
            {
                id: 2,
                name: "Collection",
                list: []
            },
            {
                id: 3,
                name: "Location",
                list: []
            }

        ];

    }

    angular
        .module('nypl_locations')
        .controller('CollectionsCtrl', CollectionsCtrl);
})();
