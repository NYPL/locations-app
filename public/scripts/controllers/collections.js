/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $location, $ */

(function () {
    'use strict';

    function CollectionsCtrl(
        $scope,
        $rootScope,
        config,
        divisions,
        terms,
        nyplLocationsService,
        nyplUtility
    ) {
        'use strict';
        $scope.terms = terms;

        $scope.divisions = divisions;

        $scope.setSubterms = function (index, name) {
            var subterms;
            if (name == 'Subjects') {
                subterms = _.chain(terms[index].terms)
                    .pluck('terms')
                    .flatten(true)
                    .unique()
                    .value();
            } else {
                subterms = terms[index].terms;
            }

            $scope.termIndex = index;
            $scope.subterms = subterms;
        };

        $scope.filterDivisions = function (name) {
            var updatedDivisions = [],
                i = 0;

            for (i; i < divisions.length; i++) {
                if (divisions[i].terms) {
                    console.log(divisions[i].name);
                    _.each(divisions[i].terms, function (term) {
                        console.log(term.terms);

                        // if (_.contains(term.terms, {name: name})) {
                        //     console.log('test');
                        // }
                        var test = _.find(term.terms, function (term) {
                            // console.log(term);
                            return term.name = name;
                        });

                        console.log(test);
                    });
                    // console.log(divisions[i].terms[$scope.termIndex].terms)
                    // if (_.has(divisions[i].terms[$scope.termIndex].terms, name)) {
                    //     console.log('test');
                    // }
                }
            }

            $scope.divisions = updatedDivisions;
        };

        $rootScope.title = "Research Collections";
        $scope.hoursToday = nyplUtility.hoursToday;

    }

    angular
        .module('nypl_locations')
        .controller('CollectionsCtrl', CollectionsCtrl);
})();
